import sqlite3

database_file = "db5.sqlite3"

# def show_table_structure(database_file):
#     # Connect to the database
#     conn = sqlite3.connect(database_file)
#     cursor = conn.cursor()

#     # Query the SQLite master table to get the table names
#     cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
#     tables = cursor.fetchall()

#     # Loop through each table and display its structure
#     for table in tables:
#         table_name = table[0]
#         print(f"Table: {table_name}")
#         cursor.execute(f"PRAGMA table_info({table_name});")
#         columns = cursor.fetchall()
#         for column in columns:
#             print(column)
#         print() 
#     conn.close()


# show_table_structure(database_file)

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
# def insert():
# 	a = '''INSERT INTO userman_player (id, password, last_login, coins, status, level, email, username, first_name, last_name, is_active, is_staff, is_superuser, date_joined, image) VALUES
# 	(1, 'pbkdf2_sha256$600000$nMH2GPWBUasKNTznJuKNNM$MZUsrvN/H2/EPL/eHWDn1BzUH6DUTDi9Qxkorz6H+GU=', 'None', 0, 'F', 0, 'user1@mail.com', 'user1', '', '', 1, 0, 0, '2024-05-11 08:56:30.288940', 'default.png'),
# 	(2, 'pbkdf2_sha256$600000$9yFpZTt5U1UKGrz6hpHhoJ$byR92a4bj/8oxMMBwhzzy6jv4r8nLEd0DgTLDFd9CZw=', 'None', 0, 'F', 0, 'user2@mail.com', 'user2', '', '', 1, 0, 0, '2024-05-11 08:56:49.319780', 'default.png'),
# 	(3, 'pbkdf2_sha256$600000$PZaeWOUtaJ2ji0yxNXwhGs$jbNAXiFSJTcNXHkoEuWqThgawG+JFltKmyLX6rKibLA=', '2024-05-11 10:47:01.961642', 0, 'F', 0, 'zmakhkha@mail.com', 'zmakhkha', '', '', 1, 1, 1, '2024-05-11 10:46:48.971074', 'default.png'),
# 	(4, 'MKSzak123', 'None', 250, 'F', 750, 'user3@mail.com', 'user3', '', '', 1, 0, 0, '2024-05-11 10:52:16.530152', 'store/images/default.png'),
# 	(5, 'pbkdf2_sha256$600000$pMopVrCnm9xo8MzDZULA7h$dSUXMp8KKEzTmyVqb/KdnCFUATCyTpTgaByGa9X9THk=', 'None', 0, 'F', 0, 'user4@mail.com', 'user4', '', '', 1, 0, 0, '2024-05-11 12:43:09.696539', 'default.png'),
# 	(6, 'pbkdf2_sha256$600000$OZTy2G9yrLDfPse8z59Ec6$c05jOk5Yb6vN48igf6Qy2YOXvhVX6dXHavvRNyFhy74=', 'None', 0, 'F', 0, 'user5@mail.com', 'user5', '', '', 1, 0, 0, '2024-05-11 12:43:18.854501', 'default.png'),
# 	(7, 'pbkdf2_sha256$600000$IwoDiiyy24RAsrYOCrQ2Dp$M8uud+YXRbM8HKgUpMyxwJznNdd1WfpKAm1CgnDETtc=', 'None', 0, 'F', 0, 'user6@mail.com', 'user6', '', '', 1, 0, 0, '2024-05-11 12:43:29.150999', 'default.png'),
# 	(8, 'pbkdf2_sha256$600000$K2xUssQTjEk6gTEpXXidYb$/uZLJSs2OXkPCLtlnv0BugndZ4FIVSLD0sY5bd+2e1w=', 'None', 0, 'F', 0, 'user7@mail.com', 'user7', '', '', 1, 0, 0, '2024-05-11 12:43:38.293461', 'default.png'),
# 	(9, 'pbkdf2_sha256$600000$Ac0xlVtuUg4fe0KLK7x3kO$uXsSNF9kHA7pHm5NGQJHTE5G2Z06fhPlW+gBw1z5DLU=', 'None', 0, 'F', 0, 'user8@mail.com', 'user8', '', '', 1, 0, 0, '2024-05-11 12:43:46.452320', 'default.png'),
# 	(10, 'pbkdf2_sha256$600000$5JEHSSB6H3ncsDEjZCQj1i$3zobDaC7T6ALYnfxoREaxDewrS2q7zcsjUVnVVSsWfw=', 'None', 0, 'F', 0, 'user9@mail.com', 'user9', '', '', 1, 0, 0, '2024-05-11 12:43:56.194296', 'default.png'),
# 	(11, 'pbkdf2_sha256$600000$Pl82NVokTVT57OqEQZKVFB$BShF8SfCjxD9Ghbc6xSRFeND7JR0CmhYNetfny9lFJk=', 'None', 0, 'F', 0, 'user10@mail.com', 'user10', '', '', 1, 0, 0, '2024-05-11 12:44:06.887556', 'default.png')
# 	;'''
# 	conn = sqlite3.connect('db5.sqlite3')
# 	cursor = conn.cursor()
# 	cursor.execute(a)
# 	rows = cursor.fetchall()
# 	for row in rows:
# 		print(row)
# 	conn.close()

# # get_players()
# insert()

import sqlite3



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
