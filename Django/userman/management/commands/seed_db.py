from django.core.management.base import BaseCommand
from django.db import connection
from pathlib import Path
import os


import os
from pathlib import Path
from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Populates the database with collections and products'

    def handle(self, *args, **options):
        print('Populating the database...')
        current_dir = os.path.dirname(__file__)
        file_path = os.path.join(current_dir, 'data.sql')
        sql = Path(file_path).read_text()

        with connection.cursor() as cursor:
            sql_commands = sql.split(';')  
            for command in sql_commands:
                command = command.strip()  
                if command:
                    cursor.execute(command)