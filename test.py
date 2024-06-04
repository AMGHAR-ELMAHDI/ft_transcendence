# room = {}

# room[0] = {
# 	'players': {
# 		'mnassi': 1,
# 	},
# 	'AvailablePlayers': 0,
# }
# room[1] = {
# 	'players': {
# 		'mbachar': 1,
# 	},
# 	'AvailablePlayers': 0,
# }
# room[2] = {
# 	'players': {
# 		'otchekai': 1,
# 	},
# 	'AvailablePlayers': 0,
# }
# room[3] = {
# 	'players': {
# 		'absaid': 1,
# 	},
# 	'AvailablePlayers': 0,
# }

# username = 'absaid'

# for skey, value in room.items():
# 	for key in value['players']:
# 		if key == username:
# 			print(f'found {skey}')
# 		else:
# 			print('not found')

room = 'bertouch_5'
pos = room.find('_')
len = len(room)

print(room[pos + 1:len])