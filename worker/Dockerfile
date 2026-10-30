
FROM python:3.11-slim

# Install LibreOffice and fonts, including Gujarati Unicode support
RUN apt-get update && apt-get install -y --no-install-recommends \
    libreoffice-writer \
    fonts-liberation \
    fonts-dejavu-core \
    fonts-noto-core \
    fonts-noto-extra \
    fontconfig \
    && fc-cache -f -v \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .

ENV PORT=8000
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

EXPOSE 8000

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]
