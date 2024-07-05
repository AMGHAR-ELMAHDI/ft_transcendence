# your_app/management/commands/populate_postgres.py
from django.core.management.base import BaseCommand
from django.db import connection
from pathlib import Path
import os

class Command(BaseCommand):
    help = 'Populates the PostgreSQL database with initial data'

    def handle(self, *args, **options):
        print('Populating the PostgreSQL database...')
        current_dir = os.path.dirname(__file__)
        file_path = os.path.join(current_dir, 'data.sql')
        sql = Path(file_path).read_text()

        with connection.cursor() as cursor:
            sql_commands = sql.split(';')  
            for command in sql_commands:
                command = command.strip()  
                if command:
                    cursor.execute(command)
        self.stdout.write(self.style.SUCCESS('Successfully populated the PostgreSQL database'))
