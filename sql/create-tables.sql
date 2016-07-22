BEGIN;
  CREATE TABLE photos (
    id text NOT NULL PRIMARY KEY,
    owner text NOT NULL,
    secret text NOT NULL,
    server text NOT NULL,
    title text NOT NULL,
    date_taken timestamp with time zone NOT NULL,
    position geography(POINT,4326));

  CREATE TABLE photosets (
    id text NOT NULL PRIMARY KEY,
    title text NOT NULL);

  CREATE TABLE photoset_photos (
    photo_id text NOT NULL,
    photoset_id text NOT NULL,
    PRIMARY KEY (photo_id, photoset_id));
COMMIT;
