import sqlite3

database_file = "db5.sqlite3"

def show_table_structure():
    # Connect to the database
    conn = sqlite3.connect(database_file)
    cursor = conn.cursor()

    # Query the SQLite master table to get the table names
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()

    # Loop through each table and display its structure
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
# Connect to the SQLite database
	conn = sqlite3.connect(database_file)
	cursor = conn.cursor()
	cursor.execute(f'SELECT * FROM {table}')
	rows = cursor.fetchall()
	for row in rows:
		print(row)
	conn.close()
get_data('userman_friendshiprequest')
print("----------")
    
# show_table_structure()

get_data('userman_gamehistory')





# def insert_data(database_file, data):
#     # Connect to the database
#     conn = sqlite3.connect(database_file)
#     cursor = conn.cursor()

#     # Define the SQL statement for insertion
#     sql_insert = """INSERT INTO userman_player 
#                     (id, password, last_login, coins, status, level, email, username, 
#                      first_name, last_name, is_active, is_staff, is_superuser, date_joined, image) 
#                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"""

#     # Execute the SQL statement for each data row
#     for row in data:
#         cursor.execute(sql_insert, row)

#     # Commit the changes and close the connection
#     conn.commit()
#     conn.close()

# # Provide the path to your SQLite database file

# # Example data to insert into the table
# data_to_insert = [
#     (1, 'password123', '2024-05-11 10:30:00', 100, 'A', 5, 'example@example.com', 'example_user', 
#      'John', 'Doe', True, False, False, '2024-05-11 10:30:00', 'example.jpg'),
#     # Add more rows as needed
# ]

# # Call the function to insert data
# insert_data(database_file, data_to_insert)
