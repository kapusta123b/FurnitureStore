FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    netcat-openbsd \
    gcc \
    python3-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install python dependencies
RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Fix entrypoint permissions and line endings
RUN sed -i 's/\r$//g' /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Create non-root user and change ownership
RUN useradd -s /bin/sh -u 1234 nonroot
RUN chown -R nonroot:nonroot /app

# Ensure we start as root to fix volume permissions in entrypoint
USER root

ENTRYPOINT [ "/app/entrypoint.sh" ]
