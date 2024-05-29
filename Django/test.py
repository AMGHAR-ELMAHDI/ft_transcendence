import random

def generate_dummy_player_sql():
    players = []
    for i in range(20):
        username = f'player_{i}'
        email = f'player{i}@example.com'
        first_name = f'First_{i}'
        last_name = f'Last_{i}'
        level = random.randint(1, 50)  # Assuming levels range from 1 to 50
        coins = random.randint(0, 1000)  # Assuming coins range from 0 to 1000
        status = random.choice(['O', 'F'])  # Randomly select online or offline status
        password = 'MKSzak123'
        player_sql = f"INSERT INTO userman_player (username, email, first_name, last_name, level, coins, status, password) VALUES ('{username}', '{email}', '{first_name}', '{last_name}', {level}, {coins}, '{status}', '{password}');"
        players.append(player_sql)
    return players

dummy_player_sql = generate_dummy_player_sql()

for sql in dummy_player_sql:
    print(sql)