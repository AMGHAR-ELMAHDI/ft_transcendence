import sqlite3

database_file = "db5.sqlite3"

def show_table_structure():
    conn = sqlite3.connect(database_file)
    cursor = conn.cursor()

    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()

    for table in tables:
        table_name = table[0]
        
        print(f"Table: {table_name}")
        cursor.execute(f"PRAGMA table_info({table_name});")
        columns = cursor.fetchall()
        for column in columns:
            print(column)
        print() 
    conn.close()


def get_data(table):
	conn = sqlite3.connect(database_file)
	cursor = conn.cursor()
	cursor.execute(f'SELECT * FROM {table}')
	rows = cursor.fetchall()
	for row in rows:
		print(row)
	conn.close()
    
