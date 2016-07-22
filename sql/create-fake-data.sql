BEGIN;
  INSERT INTO photos (id, owner, secret, server, farm, title, date_taken, position) VALUES ('27859607903', '142180152@N04', '01b392ba0c', '8191', '9', '20160720_NooraQvick_Rakentelu1', '2016-07-20', ST_GeographyFromText('SRID=4326;POINT(61.209260 25.116956)'));
  INSERT INTO photos (id, owner, secret, server, farm, title, date_taken, position) VALUES ('28442735206', '142180152@N04', 'b536f930b8', '8567', '9', '20160721-TuomasSauliala-Rakennusleiri_9678', '2016-07-21', ST_GeographyFromText('SRID=4326;POINT(61.206689 25.115078)'));
  INSERT INTO photos (id, owner, secret, server, farm, title, date_taken, position) VALUES ('28397009701', '142180152@N04', '555dbaa0d5', '8470', '9', '20160721-TuomasSauliala-Rakennusleiri_9577', '2016-07-21', ST_GeographyFromText('SRID=4326;POINT(61.207602 25.128703)'));
  INSERT INTO photos (id, owner, secret, server, farm, title, date_taken, position) VALUES ('27859188003', '142180152@N04', '98658490ba', '8821', '9', '20160721-TuomasSauliala-Keidas-0147', '2016-07-21', ST_GeographyFromText('SRID=4326;POINT(61.202606 25.118766)'));
  INSERT INTO photos (id, owner, secret, server, farm, title, date_taken, position) VALUES ('28191966400', '142180152@N04', 'e2d2340df9', '8788', '9', '20160721-TuomasSauliala-Keidas-0153', '2016-07-21', ST_GeographyFromText('SRID=4326;POINT(61.202606 25.118766)'));
  INSERT INTO photos (id, owner, secret, server, farm, title, date_taken, position) VALUES ('27854440514', '142180152@N04', '5a63a1ce38', '8670', '9', '20160722_NooraQvick_Globaalilaakso_017', '2016-07-22', ST_GeographyFromText('SRID=4326;POINT(61.206315 25.112999)'));

  INSERT INTO photosets (id, title) VALUES ('1', 'Rakennusleiri');
  INSERT INTO photosets (id, title) VALUES ('2', 'Keidas');
  INSERT INTO photosets (id, title) VALUES ('3', 'Tuomas sauliala');

  INSERT INTO photoset_photos (photo_id, photoset_id) VALUES ('27859607903', '1');
  INSERT INTO photoset_photos (photo_id, photoset_id) VALUES ('28442735206', '1');
  INSERT INTO photoset_photos (photo_id, photoset_id) VALUES ('28397009701', '1');
  INSERT INTO photoset_photos (photo_id, photoset_id) VALUES ('27859188003', '2');
  INSERT INTO photoset_photos (photo_id, photoset_id) VALUES ('28191966400', '2');
  INSERT INTO photoset_photos (photo_id, photoset_id) VALUES ('28442735206', '3');
  INSERT INTO photoset_photos (photo_id, photoset_id) VALUES ('28397009701', '3');
  INSERT INTO photoset_photos (photo_id, photoset_id) VALUES ('27859188003', '3');
  INSERT INTO photoset_photos (photo_id, photoset_id) VALUES ('28191966400', '3');
COMMIT;
