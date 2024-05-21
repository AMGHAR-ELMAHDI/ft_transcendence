room = {}

room[0] = {
	'players': {
		'mnassi': 1,
	},
	'AvailablePlayers': 0,
}
players = {
	'name_1': {
		'name': '...',
	},
	'name_2': {
		'name': '...',
	},
	'name_3': {
		'name': '...',
	},
	'name_4': {
		'name': '...',
	},
}

for key, value in room[0]['players'].items():
	players[f'name_{value}'] = {'name': key}

print(players)