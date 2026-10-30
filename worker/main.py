
import os
import subprocess
import tempfile
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from PIL import Image

app = FastAPI(title="PDF Tools Conversion API", version="0.1.1")

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
    os.getenv("MAX_UPLOAD_BYTES", str(25 * 1024 * 1024))
)


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
                    detail="File exceeds the current upload limit."
                )

            out.write(chunk)

    if size == 0:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is empty."
        )

    return target


def pdf_response(pdf_bytes):
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": 'attachment; filename="converted.pdf"'
        }
    )


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "pdf-tools-converter"
    }


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
            with Image.open(source) as img:
                if img.mode in ("RGBA", "LA"):
                    background = Image.new("RGB", img.size, "white")
                    alpha = img.getchannel("A") if "A" in img.getbands() else None
                    background.paste(img.convert("RGB"), mask=alpha)
                    converted = background
                else:
                    converted = img.convert("RGB")

                converted.save(
                    output,
                    "PDF",
                    resolution=150.0
                )

            # Read PDF into memory before temporary folder is deleted
            pdf_bytes = output.read_bytes()

        except Exception as exc:
            raise HTTPException(
                status_code=422,
                detail=f"Could not process this image: {exc}"
            )

    return pdf_response(pdf_bytes)


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

        # Read PDF into memory before temporary folder is deleted
        pdf_bytes = output.read_bytes()

    return pdf_response(pdf_bytes)
