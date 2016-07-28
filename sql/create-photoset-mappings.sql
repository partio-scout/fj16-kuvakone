BEGIN;

  TRUNCATE photoset_group, photoset_group_mapping;

  INSERT INTO photoset_group (id, title, title_sv, title_en) VALUES ('1', 'Rakennusleiri', 'Byggläger', 'Assembly camp');
  INSERT INTO photoset_group_mapping (group_id, photoset_id) VALUES ('1', '72157668229169113'); -- Rakennusleiri 15.7.
  INSERT INTO photoset_group_mapping (group_id, photoset_id) VALUES ('1', '72157671050963776'); -- Rakennusleiri 16.7.
  INSERT INTO photoset_group_mapping (group_id, photoset_id) VALUES ('1', '72157670154861180'); -- Rakennusleiri 17.7.
  INSERT INTO photoset_group_mapping (group_id, photoset_id) VALUES ('1', '72157670509751181'); -- Rakennusleiri 18.7.

  INSERT INTO photoset_group (id, title, title_sv, title_en) VALUES ('2', 'Leiri', 'Läger', 'Camp');
  INSERT INTO photoset_group_mapping (group_id, photoset_id) VALUES ('2', '72157670550293472'); -- Leirille saapuminen 20.7.
  INSERT INTO photoset_group_mapping (group_id, photoset_id) VALUES ('2', '72157670299811500'); -- Leiripäivä 21.1.
  INSERT INTO photoset_group_mapping (group_id, photoset_id) VALUES ('2', '72157670657022721'); -- Leiripäivä 22.7.
  INSERT INTO photoset_group_mapping (group_id, photoset_id) VALUES ('2', '72157671344045826'); -- Leiripäivä 23.7.
  INSERT INTO photoset_group_mapping (group_id, photoset_id) VALUES ('2', '72157668554278933'); -- Vierailupäivä ja keskiäiset 24.7.
  INSERT INTO photoset_group_mapping (group_id, photoset_id) VALUES ('2', '72157670786425911'); -- Leiripäivä 25.7.
  INSERT INTO photoset_group_mapping (group_id, photoset_id) VALUES ('2', '72157670825106731'); -- Leiripäivä 26.7.
  INSERT INTO photoset_group_mapping (group_id, photoset_id) VALUES ('2', '72157671632611595'); -- Leiripäivä 27.7.

COMMIT;
