CREATE SCHEMA kick_counter;

CREATE TABLE kick_counter.mother (
 id    serial PRIMARY KEY,
 name  varchar(60),
 password  varchar(255));

 INSERT INTO kick_counter.mother
  VALUES 	('Madeline', 'tho16031@byui.edu'),
  			('Sue', 'sue@byui.edu');

   CREATE TABLE kick_counter.kick_session (
   id           serial PRIMARY KEY,
   start_time   TIMESTAMP,
   end_time     TIMESTAMP,
   mother_id  	int REFERENCES kick_counter.mother (id));

   INSERT INTO kick_counter.kick_session
    VALUES (, (SELECT id FROM person WHERE name = 'Madeline')),
    (, , (SELECT id FROM person WHERE name = 'Sue')),
    (, (SELECT id FROM person WHERE name = 'Sue'));

     CREATE TABLE kick_counter.kick (
     id    serial PRIMARY KEY,
     time  TIMESTAMP,
     kick_session_id     	int REFERENCES kick_counter.kick_session (id));

     INSERT INTO kick_counter.kick
      VALUES ('Bob', 'Parr', 1970-01-08);
