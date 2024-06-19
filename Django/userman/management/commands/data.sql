-- INSERT INTO userman_item (type, name, price, path) VALUES
-- ('B', 'Ball 1', 10.00, 'http://localhost:2500/media/items/default.png'),
-- ('B', 'Ball 2', 10.00, 'http://localhost:2500/media/items/default.png'),
-- ('B', 'Ball 3', 10.00, 'http://localhost:2500/media/items/default.png'),
-- ('B', 'Ball 4', 10.00, 'http://localhost:2500/media/items/default.png'),
-- ('B', 'Ball 5', 10.00, 'http://localhost:2500/media/items/default.png'),

-- ('P', 'Paddle 1', 15.00, 'http://localhost:2500/media/default.png'),
-- ('P', 'Paddle 2', 15.00, 'http://localhost:2500/media/default.png'),
-- ('P', 'Paddle 3', 15.00, 'http://localhost:2500/media/default.png'),
-- ('P', 'Paddle 4', 15.00, 'http://localhost:2500/media/default.png'),
-- ('P', 'Paddle 5', 15.00, 'http://localhost:2500/media/default.png'),

-- ('G', 'Background 1', 5.00, 'http://localhost:2500/media/default.png'),
-- ('G', 'Background 2', 5.00, 'http://localhost:2500/media/default.png'),
-- ('G', 'Background 3', 5.00, 'http://localhost:2500/media/default.png'),
-- ('G', 'Background 4', 5.00, 'http://localhost:2500/media/default.png'),
-- ('G', 'Background 5', 5.00, 'http://localhost:2500/media/default.png'),

-- ('A', 'Avatar 1', 20.00, 'http://localhost:2500/media/default.png'),
-- ('A', 'Avatar 2', 20.00, 'http://localhost:2500/media/default.png'),
-- ('A', 'Avatar 3', 20.00, 'http://localhost:2500/media/default.png'),
-- ('A', 'Avatar 4', 20.00, 'http://localhost:2500/media/default.png'),
-- ('A', 'Avatar 5', 20.00, 'http://localhost:2500/media/default.png');

INSERT INTO userman_player ('password','last_login','coins','status','level','email','username','first_name','last_name','is_active','is_staff','is_superuser','date_joined','image')
 VALUES
( 'pbkdf2_sha256$600000$nMH2GPWBUasKNTznJuKNNM$MZUsrvN/H2/EPL/eHWDn1BzUH6DUTDi9Qxkorz6H+GU=', '2024-05-11 10:30:00', 500, 'F', 700, 'user1@mail.com', 'user1', '', '', 1, 0, 0, '2024-05-11 08:56:30.288940', 'media/store/images/default.png'),
( 'pbkdf2_sha256$600000$9yFpZTt5U1UKGrz6hpHhoJ$byR92a4bj/8oxMMBwhzzy6jv4r8nLEd0DgTLDFd9CZw=', '2024-05-11 10:30:00', 1000, 'F', 5680, 'user2@mail.com', 'user2', '', '', 1, 0, 0, '2024-05-11 08:56:49.319780', 'media/store/images/default.png'),
( 'pbkdf2_sha256$600000$nMH2GPWBUasKNTznJuKNNM$MZUsrvN/H2/EPL/eHWDn1BzUH6DUTDi9Qxkorz6H+GU=', '2024-05-11 10:30:00', 4586, 'F', 1468, 'user3@mail.com', 'user3', '', '', 1, 0, 0, '2024-05-11 08:56:30.288940', 'media/store/images/default.png'),
( 'pbkdf2_sha256$600000$PZaeWOUtaJ2ji0yxNXwhGs$jbNAXiFSJTcNXHkoEuWqThgawG+JFltKmyLX6rKibLA=', '2024-05-11 10:47:01.961642', 0, 'F', 10236, 'zmakhkha@mail.com', 'zmakhkha', '', '', 1, 1, 1, '2024-05-11 10:46:48.971074', 'media/store/images/default.png'),
( 'pbkdf2_sha256$600000$pMopVrCnm9xo8MzDZULA7h$dSUXMp8KKEzTmyVqb/KdnCFUATCyTpTgaByGa9X9THk=', '2024-05-11 10:30:00', 4756, 'F', 9999, 'user4@mail.com', 'user4', '', '', 1, 0, 0, '2024-05-11 12:43:09.696539', 'media/store/images/default.png'),
( 'pbkdf2_sha256$600000$OZTy2G9yrLDfPse8z59Ec6$c05jOk5Yb6vN48igf6Qy2YOXvhVX6dXHavvRNyFhy74=', '2024-05-11 10:30:00', 1423, 'F', 1458, 'user5@mail.com', 'user5', '', '', 1, 0, 0, '2024-05-11 12:43:18.854501', 'media/store/images/default.png'),
( 'pbkdf2_sha256$600000$IwoDiiyy24RAsrYOCrQ2Dp$M8uud+YXRbM8HKgUpMyxwJznNdd1WfpKAm1CgnDETtc=', '2024-05-11 10:30:00', 486, 'F', 1023, 'user6@mail.com', 'user6', '', '', 1, 0, 0, '2024-05-11 12:43:29.150999', 'media/store/images/default.png'),
( 'pbkdf2_sha256$600000$K2xUssQTjEk6gTEpXXidYb$/uZLJSs2OXkPCLtlnv0BugndZ4FIVSLD0sY5bd+2e1w=', '2024-05-11 10:30:00', 45, 'F', 4125, 'user7@mail.com', 'user7', '', '', 1, 0, 0, '2024-05-11 12:43:38.293461', 'media/store/images/default.png'),
( 'pbkdf2_sha256$600000$Ac0xlVtuUg4fe0KLK7x3kO$uXsSNF9kHA7pHm5NGQJHTE5G2Z06fhPlW+gBw1z5DLU=', '2024-05-11 10:30:00', 10, 'F', 140, 'user8@mail.com', 'user8', '', '', 1, 0, 0, '2024-05-11 12:43:46.452320', 'media/store/images/default.png'),
( 'pbkdf2_sha256$600000$5JEHSSB6H3ncsDEjZCQj1i$3zobDaC7T6ALYnfxoREaxDewrS2q7zcsjUVnVVSsWfw=', '2024-05-11 10:30:00', 7896, 'F', 486, 'user9@mail.com', 'user9', '', '', 1, 0, 0, '2024-05-11 12:43:56.194296', 'media/store/images/default.png'),
( 'pbkdf2_sha256$600000$Pl82NVokTVT57OqEQZKVFB$BShF8SfCjxD9Ghbc6xSRFeND7JR0CmhYNetfny9lFJk=', '2024-05-11 10:30:00', 98562, 'F', 1023, 'user10@mail.com', 'user10', '', '', 1, 0, 0, '2024-05-11 12:44:06.887556', 'media/store/images/default.png')
;

-- INSERT INTO userman_friendshiprequest
-- ('status','created_at','from_user_id','to_user_id') VALUES
-- ('A', '2024-05-11 13:37:35.154298', 2, 1),
-- ('A', '2024-05-11 13:37:35.154298', 3, 1),
-- ('P', '2024-05-11 13:37:35.154298', 4, 1),
-- ('A', '2024-05-11 13:37:35.154298', 5, 1),
-- ('P', '2024-05-11 13:37:35.154298', 6, 1),
-- ('P', '2024-05-11 13:37:35.154298', 7, 1),
-- ('R', '2024-05-11 13:37:35.154298', 8, 1),
-- ('R', '2024-05-11 13:37:35.154298', 2, 3),
-- ('P', '2024-05-11 13:37:35.154298', 2, 4),
-- ( 'P', '2024-05-11 13:37:35.154298', 2, 5),
-- ( 'P', '2024-05-11 13:37:35.154298', 2, 6),
-- ( 'P', '2024-05-11 13:37:35.154298', 2, 7),
-- ( 'P', '2024-05-11 13:37:35.154298', 2, 8),
-- ( 'A', '2024-05-11 13:50:05.024276', 1, 1),
-- ( 'P', '2024-05-11 13:52:08.910347', 1, 7),
-- ( 'P', '2024-05-11 13:52:21.025031', 1, 9),
-- ( 'P', '2024-05-11 13:52:44.809518', 1, 4),
-- ( 'R', '2024-05-11 14:28:57.991794', 1, 3);

-- INSERT INTO userman_friendship
-- ('id','created_at','player1_id','player2_id') VALUES
-- (1, '2024-05-11 16:12:05.261525', 2, 1),
-- (2, '2024-05-11 16:16:09.468398', 3, 1),
-- (3, '2024-05-11 16:16:24.140282', 5, 1);

-- INSERT INTO  userman_gamehistory
-- ('date','player_score','opponent_score','game_mode','game_duration_minutes','opponent_id','player_id') VALUES
-- ('2024-05-11 16:35:58.852097', 10, 5, 'O', 5, 2, 1),
-- ('2024-05-11 16:35:58.852097', 13, 27, 'B', 5, 2, 1),
-- ('2024-05-11 16:35:58.852097', 15, 25, 'T', 5, 2, 1),
-- ('2024-05-11 16:35:58.852097', 17, 16, 'O', 5, 2, 1),
-- ('2024-05-11 16:35:58.852097', 15, 20, 'O', 5, 2, 1),
-- ('2024-05-11 16:35:58.852097', 11, 11, 'O', 5, 2, 1),
-- ('2024-05-11 16:35:58.852097', 8, 14, 'O', 5, 2, 1),
-- ('2024-05-11 16:36:39.432539', 78, 50, 'B', 8, 5, 9),
-- ('2024-05-11 16:36:39.432539', 25, 45, 'B',18, 5, 9),
-- ('2024-05-11 16:36:39.432539', 11, 5, 'B', 85, 5, 9),
-- ('2024-05-11 16:36:39.432539', 7, 5, 'B', 8, 5, 9),
-- ('2024-05-11 16:36:39.432539', 6, 45, 'B', 8, 5, 9),
-- ('2024-05-11 16:36:56.663758', 14, 15, 'T', 6, 5, 5);

-- INSERT INTO  userman_achievement
-- ('path','desc','title') VALUES
-- ('http://localhost:2500/media/achievements/ach1.png', 'Win your first Match against a Bot', 'First Bot Win'),
-- ('http://localhost:2500/media/achievements/ach2.png', 'Win your first Match against a player', 'First Win'),
-- ('http://localhost:2500/media/achievements/Actually Bad.png', 'Win 5 Matches in a row', 'Unstoppable'),
-- ('http://localhost:2500/media/achievements/Bullied2.png', 'Win 10 Matches in a row', 'Touch Some Grass'),
-- ('http://localhost:2500/media/achievements/Champion2.png', 'lose  your first Match against a player', 'First Loss'),
-- ('http://localhost:2500/media/achievements/default.png', 'Win a Match in less then 5 min', 'Fast AF Boiiiii'),
-- ('http://localhost:2500/media/achievements/DefeatBot3.png', 'Win 20 Matches in a row', 'How?'),
-- ('http://localhost:2500/media/achievements/DefeatBot6.png', 'Lose a Match in less than 5 min', 'Actually Bad'),
-- ('http://localhost:2500/media/achievements/DefeatBot7.png', 'Win a Match without being scored on', 'Unbreakable'),
-- ('http://localhost:2500/media/achievements/DefeatBot13.png', 'Win your first tournament', 'Champion'),
-- ('http://localhost:2500/media/achievements/Fast AF Boii.png', 'Buy your first item from the shop', 'Stonks'),
-- ('http://localhost:2500/media/achievements/First Loss.png', 'Buy all Items from the shop', 'Shopa-Holic'),
-- ('http://localhost:2500/media/achievements/FirstWin2.png', 'Play your first match', 'Rookie'),
-- ('http://localhost:2500/media/achievements/Get A Life.png', 'Lose without scoring', 'Bullied'),
-- ('http://localhost:2500/media/achievements/How?.png', 'Acquire all trophies', 'Get A Life'),
-- ('http://localhost:2500/media/achievements/playFirstBotMatch.png', 'Play your first match2', 'Rookie1'),
-- ('http://localhost:2500/media/achievements/Rookie.png', 'Lose without scoring2', 'Bullied1'),
-- ('http://localhost:2500/media/achievements/Shop-a-Holic.png', 'Acquire all trophies1', 'Get A Life2'),
-- ('http://localhost:2500/media/achievements/Stonks.png', 'Play your first match3', 'Rookie2'),
-- ('http://localhost:2500/media/achievements/touchGrass.png', 'Lose without scoring3', 'Bullied2'),
-- ('http://localhost:2500/media/achievements/Unbreakable.png', 'Acquire all trophies2', 'Get A Life3'),
-- ('http://localhost:2500/media/achievements/Unstoppable.png', 'Play your first match4', 'Rookie3'),
-- ('http://localhost:2500/media/achievements/Unstoppable2.png', 'Lose without scoring4', 'Bullied3');

-- INSERT INTO  userman_item
-- ('path', 'type','name','price') VALUES
-- ('http://localhost:2500/media/default.png', 'P','name0', 100),
-- ('http://localhost:2500/media/default.png', 'P','name1', 900),
-- ('http://localhost:2500/media/default.png', 'P','name2', 600),
-- ('http://localhost:2500/media/default.png', 'P','name3', 700),
-- ('http://localhost:2500/media/default.png', 'B','name4', 600),
-- ('http://localhost:2500/media/default.png', 'B','name5', 800),
-- ('http://localhost:2500/media/default.png', 'B','name6', 700),
-- ('http://localhost:2500/media/default.png', 'G','name7', 800),
-- ('http://localhost:2500/media/default.png', 'A','name8', 100),
-- ('http://localhost:2500/media/default.png', 'P','name9', 100000);

-- INSERT INTO  userman_achievementperuser
-- ('user_id', 'achievement_id','obtaining_date') VALUES
-- (1, 1, '2024-05-01 16:35:58.852097'),
-- (1, 2, '2024-05-05 16:35:58.852097'),
-- (1, 3, '2024-05-06 16:35:58.852097'),
-- (1, 4, '2024-05-10 16:35:58.852097');

-- INSERT INTO  userman_itemsperuser
-- ('user_id', 'item_id','purchase_date') VALUES
-- -- (1, 1, '2024-05-01 16:35:58.852097'),
-- (1, 2, '2024-05-05 16:35:58.852097'),
-- (1, 3, '2024-05-06 16:35:58.852097'),
-- (1, 30, '2024-05-10 16:35:58.852097');