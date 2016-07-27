BEGIN;
  CREATE TABLE photos (
    id text NOT NULL PRIMARY KEY,
    owner text NOT NULL,
    secret text NOT NULL,
    server text NOT NULL,
    farm text NOT NULL,
    title text NOT NULL,
    date_taken timestamp with time zone NOT NULL,
    position geography(POINT,4326));

  CREATE TABLE photosets (
    id text NOT NULL PRIMARY KEY,
    title text NOT NULL,
    title_en text,
    title_sv text);

  CREATE TABLE photoset_photos (
    photo_id text NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
    photoset_id text NOT NULL REFERENCES photosets(id) ON DELETE CASCADE,
    PRIMARY KEY (photo_id, photoset_id));

  CREATE TABLE photoset_group (
    id text NOT NULL PRIMARY KEY,
    title text NOT NULL,
    title_en text,
    title_sv text);

  CREATE TABLE photoset_group_mapping (
    group_id text NOT NULL REFERENCES photoset_group(id),
    photoset_id text NOT NULL REFERENCES photosets(id),
    PRIMARY KEY (group_id, photoset_id));
COMMIT;
