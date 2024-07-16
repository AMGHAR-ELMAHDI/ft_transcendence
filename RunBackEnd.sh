#/bin/bash

python3 -m venv venv
source venv/bin/activate
cd Django && pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py flush --no-input
python manage.py seed
daphne -e ssl:2500:privateKey=ssl/zmakhkha.key:certKey=ssl/zmakhkha.crt myChat.asgi:application
# python manage.py runserver localhost:2500
