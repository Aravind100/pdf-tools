
FROM python:3.11-slim

# Install LibreOffice and fonts, including Gujarati Unicode support
RUN apt-get update && apt-get install -y --no-install-recommends \
    libreoffice-writer \
     ghostscript \
    fonts-liberation \
    fonts-dejavu-core \
    fonts-noto-core \
    fonts-noto-extra \
    fontconfig \
    && fc-cache -f -v \
    && rm -rf /var/lib/apt/lists/*

    
# Map Microsoft Shruti font requests to Noto Sans Gujarati
RUN printf '%s\n' \
    '<?xml version="1.0"?>' \
    '<!DOCTYPE fontconfig SYSTEM "fonts.dtd">' \
    '<fontconfig>' \
    '  <alias>' \
    '    <family>Shruti</family>' \
    '    <prefer><family>Noto Sans Gujarati</family></prefer>' \
    '  </alias>' \
    '</fontconfig>' \
    > /etc/fonts/conf.avail/99-shruti.conf \
    && ln -sf /etc/fonts/conf.avail/99-shruti.conf /etc/fonts/conf.d/99-shruti.conf \
    && fc-cache -f


WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .

ENV PORT=8000
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

EXPOSE 8000

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]
