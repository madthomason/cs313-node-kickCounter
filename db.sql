CREATE TABLE mother (
 id    serial PRIMARY KEY,
 username  varchar(60),
 password  varchar(255));


 ALTER TABLE mother ADD CONSTRAINT uniq_user UNIQUE (username);

   CREATE TABLE kick_session (
   id           serial PRIMARY KEY,
   start_time   TIMESTAMP,
   end_time     TIMESTAMP,
   mother_id  	int REFERENCES mother (id));

   INSERT INTO kick_session (start_time, end_time, mother_id)
    VALUES ('2004-10-19 10:23:54', '2004-10-19 11:23:54', (SELECT id FROM mother WHERE username = 'madeline')),
    ('2004-10-19 10:23:54', '2004-10-19 10:27:54', (SELECT id FROM mother WHERE username = 'Sue')),
    ('2004-10-19 10:28:54', '2004-10-19 10:42:54', (SELECT id FROM mother WHERE username = 'Sue'));

     CREATE TABLE kick (
     id    serial PRIMARY KEY,
     time  TIMESTAMP,
     kick_session_id     	int REFERENCES kick_session (id));

     INSERT INTO kick (time, kick_session_id)
      VALUES
      ('2004-10-19 10:28:54', 3),
      ('2004-10-19 10:29:54', 3),
      ('2004-10-19 10:40:54', 3),
      ('2004-10-19 10:41:54', 3),
      ('2004-10-19 10:42:54', 3);


SELECT ks.id, ks.start_time, ks.end_time, ks.mother_id, json_agg(k.*) as kicks
FROM kick_session ks
JOIN kick k ON ks.id = k.kick_session_id
WHERE ks.id = 1
GROUP BY ks.id;

-- For dev cleanup purposes
--DELETE FROM kick WHERE kick_session_id IN (SELECT id FROM kick_session WHERE end_time IS NULL);
--DELETE FROM kick_session WHERE end_time IS NULL;
