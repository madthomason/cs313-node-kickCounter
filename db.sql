CREATE TABLE mother (
 id    serial PRIMARY KEY,
 username  varchar(60),
 password  varchar(255));

-- INSERT INTO mother (name, password)
--  VALUES 	('Madeline', 'tho16031@byui.edu'),
--  			('Sue', 'sue@byui.edu');

   CREATE TABLE kick_session (
   id           serial PRIMARY KEY,
   start_time   TIMESTAMP,
   end_time     TIMESTAMP,
   mother_id  	int REFERENCES mother (id));

   INSERT INTO kick_session (start_time, end_time, mother_id)
    VALUES ('2004-10-19 10:23:54', '2004-10-19 10:23:54', (SELECT id FROM person WHERE name = 'madeline')),
    ('2004-10-19 10:23:54', '2004-10-19 10:23:54', (SELECT id FROM person WHERE name = 'Sue')),
    ('2004-10-19 10:23:54', '2004-10-19 10:23:54', (SELECT id FROM person WHERE name = 'Sue'));

     CREATE TABLE kick (
     id    serial PRIMARY KEY,
     time  TIMESTAMP,
     kick_session_id     	int REFERENCES kick_session (id));

     INSERT INTO kick (time, kick_session_id)
      VALUES ('2004-10-19 10:23:54', );
