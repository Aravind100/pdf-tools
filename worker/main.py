
import os
import subprocess
import tempfile
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


# Compress PDF endpoint
@app.post("/convert/compress-pdf")
async def compress_pdf(file: UploadFile = File(...)):

    with tempfile.TemporaryDirectory(prefix="pdftools-compress-") as tmp:
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

            if len(reader.pages) == 0:
                raise HTTPException(
                    status_code=400,
                    detail="The PDF contains no pages."
                )

            writer = PdfWriter()
            writer.append(reader)

            # Lossless compression of PDF page content streams
            for page in writer.pages:
                page.compress_content_streams()

            output_buffer = BytesIO()
            writer.write(output_buffer)
            pdf_bytes = output_buffer.getvalue()

            writer.close()
            reader.close()

        except HTTPException:
            raise

        except Exception:
            raise HTTPException(
                status_code=422,
                detail="Could not compress this PDF. The file may be damaged or unsupported."
            )

    return pdf_response(pdf_bytes, "compressed.pdf")


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
