pip install -r requirements.txt
python manage.py flush --no-input
python manage.py makemigrations
python manage.py migrate
python manage.py seed_pg

python manage.py runserver 0.0.0.0:2500