
INSERT INTO rooms (code) 
VALUES ('WOW1');

INSERT INTO games (room_id)
VALUES (1);

INSERT INTO players (name, room_id, player_position)
VALUES ('Karl', 1, 1),
('Eddie', 1, 2),
('Mallory', 1, 3);

INSERT INTO prompts (info, game_id)
VALUES (
  '{ "word": "cat", "players" : [1, 2, 3], "drawings" : [], "guesses": [] }', 1
), (
  '{ "word": "dog", "players" : [2, 3, 1], "drawings" : [], "guesses": [] }', 1
), (
  '{ "word": "BURD", "players" : [3, 1, 2], "drawings" : [], "guesses": [] }', 1
);