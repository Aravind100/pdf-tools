# PDF Tools — starter project

A starter for a free-to-use online PDF workspace.

## Architecture
- `web/`: Next.js App Router frontend (deploy to Vercel)
- `worker/`: FastAPI conversion service (deploy to a Docker-capable host)
- The browser uploads documents to the worker; the worker returns converted files.
- This starter includes working JPG/PNG-to-PDF and DOCX-to-PDF endpoints.
- Full editing of existing PDF text/layout is a separate advanced milestone. The included editor page is a foundation, not a claim of full editing support.

## Requirements
- Node.js 20+
- Python 3.11+
- LibreOffice installed on the worker for DOCX conversion

## Run locally

### 1. Start the conversion worker
```bash
cd worker
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Install LibreOffice on the same machine and ensure `soffice` is on PATH.

### 2. Start the website
```bash
cd web
npm install
cp .env.example .env.local
npm run dev
```
Open http://localhost:3000.

Set `NEXT_PUBLIC_CONVERTER_API_URL=http://localhost:8000` in `.env.local`.

## Deploy
- Deploy `web/` as a Vercel project.
- Deploy `worker/` as a Docker service on a host that supports persistent background processes and adequate RAM/CPU.
- Set `NEXT_PUBLIC_CONVERTER_API_URL` to the public HTTPS worker URL.
- Configure CORS in `worker/main.py` for the production website origin.
- Use private temporary storage, strict upload limits, rate limiting, antivirus scanning, and scheduled deletion before public launch.

## Current conversion support
- JPG/JPEG/PNG to PDF: implemented using Pillow.
- DOCX to PDF: implemented using LibreOffice headless.
- PDF full editing, PDF-to-Word, OCR, merge/split, compression, signing and other tools: planned milestones.

## Important product and legal notes
"Unlimited" should mean no routine daily/monthly conversion quota, not unlimited file size or unlimited simultaneous compute. Apply transparent technical safeguards to protect uptime and prevent abuse.
Do not advertise perfect editing fidelity: PDFs with complex fonts, forms, scans, layers or unusual layouts may not round-trip perfectly.
