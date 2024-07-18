FROM python:3.9

ENV PYTHONUNBUFFERED 1

WORKDIR /code

COPY . /code/

RUN apt-get update && apt-get install -y \
    mariadb-client \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip
RUN chmod +x run.sh

CMD ["bash", "run.sh"]
