#/bin/bash

python3 -m venv venv
source venv/bin/activate
cd Django && pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py flush --no-input
python manage.py seed
python manage.py runserver 2500
