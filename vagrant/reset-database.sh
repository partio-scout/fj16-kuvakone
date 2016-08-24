sudo -u postgres psql -f vagrant/drop-database-and-user.sql || exit 1
sudo -u postgres psql -f vagrant/create-database-and-user.sql || exit 1

sudo -u postgres psql -c 'CREATE EXTENSION postgis;' vagrant || exit 1
sudo -u postgres psql -c 'CREATE EXTENSION postgis;' test || exit 1

psql $DATABASE_URL -f sql/create-tables.sql
