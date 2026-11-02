
import os
import subprocess
import tempfile
import zipfile
from pathlib import Path
from io import BytesIO

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from PIL import Image, ImageOps
from pypdf import PdfReader, PdfWriter

app = FastAPI(title="PDF Tools Conversion API", version="0.3.0")

allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

MAX_UPLOAD_BYTES = int(
    os.getenv("MAX_UPLOAD_BYTES", str(100 * 1024 * 1024))
)

MAX_IMAGES = 100
MAX_PDFS = 100


async def save_upload(upload, allowed_extensions, folder):
    suffix = Path(upload.filename or "").suffix.lower()

    if suffix not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type."
        )

    target = folder / f"input{suffix}"
    size = 0

    with target.open("wb") as out:
        while chunk := await upload.read(1024 * 1024):
            size += len(chunk)

            if size > MAX_UPLOAD_BYTES:
                raise HTTPException(
                    status_code=413,
                    detail="File exceeds the 100 MB upload limit."
                )

            out.write(chunk)

    if size == 0:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is empty."
        )

    return target


def pdf_response(pdf_bytes, filename="converted.pdf"):
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )


def prepare_image(source):
    """Open an image, correct EXIF rotation and handle transparency."""
    with Image.open(source) as img:
        img.load()

        img = ImageOps.exif_transpose(img)

        if "A" in img.getbands():
            rgba = img.convert("RGBA")
            background = Image.new("RGBA", rgba.size, "white")
            background.alpha_composite(rgba)
            return background.convert("RGB")

        return img.convert("RGB")


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "pdf-tools-converter"
    }


# Existing single-image endpoint
@app.post("/convert/image-to-pdf")
async def image_to_pdf(file: UploadFile = File(...)):

    with tempfile.TemporaryDirectory(prefix="pdftools-") as tmp:
        folder = Path(tmp)

        source = await save_upload(
            file,
            {".jpg", ".jpeg", ".png"},
            folder
        )

        output = folder / "converted.pdf"

        try:
            converted = prepare_image(source)

            try:
                converted.save(
                    output,
                    "PDF",
                    resolution=150.0
                )
            finally:
                converted.close()

            pdf_bytes = output.read_bytes()

        except HTTPException:
            raise

        except Exception as exc:
            raise HTTPException(
                status_code=422,
                detail=f"Could not process this image: {exc}"
            )

    return pdf_response(pdf_bytes)


# Multiple images into one PDF
@app.post("/convert/images-to-pdf")
async def multiple_images_to_pdf(files: list[UploadFile] = File(...)):

    if not files:
        raise HTTPException(
            status_code=400,
            detail="Please upload at least one image."
        )

    if len(files) > MAX_IMAGES:
        raise HTTPException(
            status_code=400,
            detail=f"You can upload a maximum of {MAX_IMAGES} images."
        )

    with tempfile.TemporaryDirectory(prefix="pdftools-") as tmp:
        folder = Path(tmp)

        converted_images = []
        total_size = 0

        try:
            for index, upload in enumerate(files):
                suffix = Path(upload.filename or "").suffix.lower()

                if suffix not in {".jpg", ".jpeg", ".png"}:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Unsupported image format: {suffix}"
                    )

                source = folder / f"image_{index}{suffix}"
                size = 0

                with source.open("wb") as out:
                    while chunk := await upload.read(1024 * 1024):
                        size += len(chunk)
                        total_size += len(chunk)

                        if total_size > MAX_UPLOAD_BYTES:
                            raise HTTPException(
                                status_code=413,
                                detail="Total image upload exceeds the 100 MB limit."
                            )

                        out.write(chunk)

                if size == 0:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Image {index + 1} is empty."
                    )

                converted_images.append(prepare_image(source))

            output = folder / "combined.pdf"

            first_image = converted_images[0]

            first_image.save(
                output,
                "PDF",
                save_all=True,
                append_images=converted_images[1:],
                resolution=150.0
            )

            pdf_bytes = output.read_bytes()

        except HTTPException:
            raise

        except Exception as exc:
            raise HTTPException(
                status_code=422,
                detail=f"Could not process images: {exc}"
            )

        finally:
            for img in converted_images:
                img.close()

    return pdf_response(pdf_bytes, "combined-images.pdf")


# NEW: Merge multiple PDF files into one PDF
@app.post("/convert/merge-pdf")
async def merge_pdf(files: list[UploadFile] = File(...)):

    if not files:
        raise HTTPException(
            status_code=400,
            detail="Please upload at least two PDF files."
        )

    if len(files) < 2:
        raise HTTPException(
            status_code=400,
            detail="Please upload at least two PDF files."
        )

    if len(files) > MAX_PDFS:
        raise HTTPException(
            status_code=400,
            detail=f"You can upload a maximum of {MAX_PDFS} PDF files."
        )

    with tempfile.TemporaryDirectory(prefix="pdftools-") as tmp:
        folder = Path(tmp)
        writer = PdfWriter()
        total_size = 0

        try:
            for index, upload in enumerate(files):
                suffix = Path(upload.filename or "").suffix.lower()

                if suffix != ".pdf":
                    raise HTTPException(
                        status_code=400,
                        detail=f"{upload.filename or 'File'} is not a PDF."
                    )

                source = folder / f"document_{index}.pdf"
                size = 0

                with source.open("wb") as out:
                    while chunk := await upload.read(1024 * 1024):
                        size += len(chunk)
                        total_size += len(chunk)

                        if total_size > MAX_UPLOAD_BYTES:
                            raise HTTPException(
                                status_code=413,
                                detail="Total PDF upload exceeds the 100 MB limit."
                            )

                        out.write(chunk)

                if size == 0:
                    raise HTTPException(
                        status_code=400,
                        detail=f"PDF {index + 1} is empty."
                    )

                try:
                    reader = PdfReader(str(source), strict=True)

                    if reader.is_encrypted:
                        raise HTTPException(
                            status_code=400,
                            detail=f"PDF {index + 1} is password-protected. Please unlock it first."
                        )

                    if len(reader.pages) == 0:
                        raise HTTPException(
                            status_code=400,
                            detail=f"PDF {index + 1} has no pages."
                        )

                    writer.append(reader)

                except HTTPException:
                    raise

                except Exception:
                    raise HTTPException(
                        status_code=422,
                        detail=f"PDF {index + 1} is invalid or damaged."
                    )

            output_buffer = BytesIO()
            writer.write(output_buffer)
            pdf_bytes = output_buffer.getvalue()

        except HTTPException:
            raise

        except Exception as exc:
            raise HTTPException(
                status_code=422,
                detail=f"Could not merge PDF files: {exc}"
            )

        finally:
            writer.close()

    return pdf_response(pdf_bytes, "merged.pdf")


# Compress PDF endpoint with three compression levels
@app.post("/convert/compress-pdf")
async def compress_pdf(
    file: UploadFile = File(...),
    level: str = Form("recommended")
):

    compression_settings = {
        "high": "/prepress",
        "recommended": "/ebook",
        "maximum": "/screen",
    }

    if level not in compression_settings:
        raise HTTPException(
            status_code=400,
            detail="Invalid compression level. Choose high, recommended or maximum."
        )

    with tempfile.TemporaryDirectory(prefix="pdftools-compress-") as tmp:
        folder = Path(tmp)

        source = await save_upload(
            file,
            {".pdf"},
            folder
        )

        output = folder / "compressed.pdf"

        try:
            reader = PdfReader(str(source), strict=True)

            if reader.is_encrypted:
                raise HTTPException(
                    status_code=400,
                    detail="Password-protected PDFs are not supported. Please unlock the PDF first."
                )

            if len(reader.pages) == 0:
                raise HTTPException(
                    status_code=400,
                    detail="The PDF contains no pages."
                )

            reader.close()

            result = subprocess.run(
                [
                    "gs",
                    "-sDEVICE=pdfwrite",
                    "-dCompatibilityLevel=1.4",
                    f"-dPDFSETTINGS={compression_settings[level]}",
                    "-dNOPAUSE",
                    "-dBATCH",
                    "-dSAFER",
                    "-dDetectDuplicateImages=true",
                    "-dCompressFonts=true",
                    "-dSubsetFonts=true",
                    f"-sOutputFile={output}",
                    str(source),
                ],
                capture_output=True,
                text=True,
                timeout=180,
                check=False
            )

            if result.returncode != 0 or not output.exists():
                raise HTTPException(
                    status_code=422,
                    detail="Could not compress this PDF. Please try another PDF file."
                )

            pdf_bytes = output.read_bytes()

            if not pdf_bytes:
                raise HTTPException(
                    status_code=422,
                    detail="Compression produced an empty PDF."
                )

            # Validate the generated PDF
            check_reader = PdfReader(BytesIO(pdf_bytes), strict=True)

            if len(check_reader.pages) == 0:
                raise HTTPException(
                    status_code=422,
                    detail="The compressed PDF is invalid."
                )

            check_reader.close()

        except HTTPException:
            raise

        except subprocess.TimeoutExpired:
            raise HTTPException(
                status_code=504,
                detail="PDF compression took too long. Please try a smaller file."
            )

        except Exception:
            raise HTTPException(
                status_code=422,
                detail="Could not process this PDF. It may be damaged or unsupported."
            )

    return pdf_response(pdf_bytes, "compressed.pdf")


# Protect PDF endpoint
@app.post("/convert/protect-pdf")
async def protect_pdf(
    file: UploadFile = File(...),
    password: str = Form(...)
):
    if len(password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least 6 characters."
        )

    if len(password) > 128:
        raise HTTPException(
            status_code=400,
            detail="Password must not exceed 128 characters."
        )

    with tempfile.TemporaryDirectory(prefix="pdftools-protect-") as tmp:
        folder = Path(tmp)

        source = await save_upload(file, {".pdf"}, folder)

        try:
            reader = PdfReader(str(source), strict=True)

            if reader.is_encrypted:
                reader.close()
                raise HTTPException(
                    status_code=400,
                    detail="This PDF is already password-protected. Please upload an unlocked PDF."
                )

            if len(reader.pages) == 0:
                reader.close()
                raise HTTPException(
                    status_code=400,
                    detail="The uploaded PDF contains no pages."
                )

            writer = PdfWriter()
            writer.append_pages_from_reader(reader)

            writer.encrypt(
                user_password=password,
                algorithm="AES-256"
            )

            output_buffer = BytesIO()
            writer.write(output_buffer)

            writer.close()
            reader.close()

            protected_pdf = output_buffer.getvalue()
            output_buffer.close()

        except HTTPException:
            raise

        except Exception:
            raise HTTPException(
                status_code=422,
                detail="Unable to protect this PDF. Please check that the file is a valid PDF."
            )

    return pdf_response(protected_pdf, "protected.pdf")


# Split PDF endpoint
@app.post("/convert/split-pdf")
async def split_pdf(
    file: UploadFile = File(...),
    mode: str = Form(...),
    pages: str = Form(""),
    ranges: str = Form("")
):

    if mode not in {"extract", "ranges", "every_page"}:
        raise HTTPException(
            status_code=400,
            detail="Invalid split mode."
        )

    with tempfile.TemporaryDirectory(prefix="pdftools-split-") as tmp:
        folder = Path(tmp)

        source = await save_upload(
            file,
            {".pdf"},
            folder
        )

        try:
            reader = PdfReader(str(source), strict=True)

            if reader.is_encrypted:
                raise HTTPException(
                    status_code=400,
                    detail="Password-protected PDFs are not supported. Please unlock the PDF first."
                )

            total_pages = len(reader.pages)

            if total_pages == 0:
                raise HTTPException(
                    status_code=400,
                    detail="The PDF contains no pages."
                )

            if mode == "extract":
                try:
                    selected_pages = [
                        int(item.strip())
                        for item in pages.split(",")
                        if item.strip()
                    ]
                except ValueError:
                    raise HTTPException(
                        status_code=400,
                        detail="Enter valid page numbers separated by commas."
                    )

                if not selected_pages:
                    raise HTTPException(
                        status_code=400,
                        detail="Please enter the pages you want to extract."
                    )

                if len(selected_pages) != len(set(selected_pages)):
                    raise HTTPException(
                        status_code=400,
                        detail="Duplicate page numbers are not allowed."
                    )

                if any(p < 1 or p > total_pages for p in selected_pages):
                    raise HTTPException(
                        status_code=400,
                        detail=f"Enter page numbers between 1 and {total_pages}."
                    )

                page_groups = [selected_pages]

            elif mode == "ranges":
                page_groups = []

                try:
                    for item in ranges.split(","):
                        item = item.strip()

                        if not item:
                            continue

                        if "-" not in item:
                            page_number = int(item)
                            start = end = page_number
                        else:
                            parts = item.split("-")

                            if len(parts) != 2:
                                raise ValueError()

                            start = int(parts[0].strip())
                            end = int(parts[1].strip())

                        if start < 1 or end > total_pages or start > end:
                            raise HTTPException(
                                status_code=400,
                                detail=f"Invalid page range: {item}. This PDF has {total_pages} pages."
                            )

                        page_groups.append(list(range(start, end + 1)))

                except ValueError:
                    raise HTTPException(
                        status_code=400,
                        detail="Enter ranges like 1-3,4-6,7-10."
                    )

                if not page_groups:
                    raise HTTPException(
                        status_code=400,
                        detail="Please enter at least one page range."
                    )

            else:
                page_groups = [
                    [page_number]
                    for page_number in range(1, total_pages + 1)
                ]

            if len(page_groups) > 100:
                raise HTTPException(
                    status_code=400,
                    detail="A maximum of 100 output PDF files is supported."
                )

            zip_buffer = BytesIO()

            with zipfile.ZipFile(
                zip_buffer,
                mode="w",
                compression=zipfile.ZIP_DEFLATED
            ) as archive:

                for index, page_group in enumerate(page_groups, start=1):
                    writer = PdfWriter()

                    for page_number in page_group:
                        writer.add_page(reader.pages[page_number - 1])

                    pdf_buffer = BytesIO()
                    writer.write(pdf_buffer)
                    writer.close()

                    if mode == "extract":
                        filename = "extracted-pages.pdf"
                    elif mode == "every_page":
                        filename = f"page-{page_group[0]}.pdf"
                    else:
                        filename = (
                            f"split-part-{index}-pages-"
                            f"{page_group[0]}-{page_group[-1]}.pdf"
                        )

                    archive.writestr(
                        filename,
                        pdf_buffer.getvalue()
                    )

                    pdf_buffer.close()

            reader.close()

            zip_bytes = zip_buffer.getvalue()
            zip_buffer.close()

        except HTTPException:
            raise

        except Exception:
            raise HTTPException(
                status_code=422,
                detail="Could not split this PDF. The file may be damaged or unsupported."
            )

    return Response(
        content=zip_bytes,
        media_type="application/zip",
        headers={
            "Content-Disposition": 'attachment; filename="split-pdf.zip"'
        }
    )


# Existing Gujarati-compatible Word-to-PDF endpoint
@app.post("/convert/docx-to-pdf")
async def docx_to_pdf(file: UploadFile = File(...)):

    with tempfile.TemporaryDirectory(prefix="pdftools-") as tmp:
        folder = Path(tmp)

        source = await save_upload(
            file,
            {".docx"},
            folder
        )

        try:
            result = subprocess.run(
                [
                    "soffice",
                    "--headless",
                    "--convert-to",
                    "pdf",
                    "--outdir",
                    str(folder),
                    str(source)
                ],
                capture_output=True,
                text=True,
                timeout=90,
                check=False
            )

        except FileNotFoundError:
            raise HTTPException(
                status_code=503,
                detail="LibreOffice is not configured."
            )

        except subprocess.TimeoutExpired:
            raise HTTPException(
                status_code=504,
                detail="Conversion took too long."
            )

        output = folder / "input.pdf"

        if result.returncode != 0 or not output.exists():
            detail = (
                result.stderr or result.stdout or "Conversion failed."
            )[-1200:]

            raise HTTPException(
                status_code=422,
                detail=detail
            )

        pdf_bytes = output.read_bytes()

    return pdf_response(pdf_bytes)
