FROM python:3.6

ENV PYTHONUNBUFFERED 1

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir /app
ADD . /app/
WORKDIR /app/crypto_prediction
RUN pip install -r requirements.txt
EXPOSE 8000
