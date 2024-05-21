room = {}

room[0] = {
	'players': {},
	'AvailablePlayers': 0,
}
room[1] = {
	'players': {},
	'AvailablePlayers': 0,
}

username = 'mnassi'

if username not in room[0]:
	room[0]['players'][username] = 1

print(room[0]['players'])
print(room[1]['players'])

