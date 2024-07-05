FROM python:3.9

ENV PYTHONUNBUFFERED 1

WORKDIR /code

COPY . /code/

RUN apt-get update && apt-get install -y \
    mariadb-client \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN python manage.py migrate
# RUN python manage.py flush --no-input

CMD ["python", "manage.py", "runserver", "0.0.0.0:2500"]