BEGIN;

  INSERT INTO photoset_group (id, title, title_en, title_sv) VALUES ('1', 'Rakennusleiri', 'SV Rakennusleiri', 'EN Rakennusleiri');
  INSERT INTO photoset_group (id, title, title_en, title_sv) VALUES ('2', 'Leiri', 'SV Leiri', 'EN Leiri');
  INSERT INTO photoset_group (id, title, title_en, title_sv) VALUES ('3', 'Avajaiset', 'SV Avajaiset', 'EN Avajaiset');

  INSERT INTO photoset_group_mapping (group_id, photoset_id) VALUES ('1', '72157670509751181');
  INSERT INTO photoset_group_mapping (group_id, photoset_id) VALUES ('1', '72157670154861180');
  INSERT INTO photoset_group_mapping (group_id, photoset_id) VALUES ('1', '72157671050963776');
  INSERT INTO photoset_group_mapping (group_id, photoset_id) VALUES ('1', '72157668229169113');
  INSERT INTO photoset_group_mapping (group_id, photoset_id) VALUES ('2', '72157670299811500');
  INSERT INTO photoset_group_mapping (group_id, photoset_id) VALUES ('2', '72157670825106731');
  INSERT INTO photoset_group_mapping (group_id, photoset_id) VALUES ('2', '72157670786425911');
  INSERT INTO photoset_group_mapping (group_id, photoset_id) VALUES ('2', '72157671344045826');
  INSERT INTO photoset_group_mapping (group_id, photoset_id) VALUES ('2', '72157670657022721');
  INSERT INTO photoset_group_mapping (group_id, photoset_id) VALUES ('3', '72157670599576341');

COMMIT;