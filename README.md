# Kuvakone
A photo filtering page

This is a web page (or an embeddable component) for viewing and filtering geotagged photos in a Flickr account. It was created for Roihu 2016, the 7th International Finnjamboree organised by the Guides and Scouts of Finland. It can be used to filter geotagged photos uploaded to a Flickr account by geographical area, date and Flickr photosets. It also provides the possibility to combine photosets, so that the search categories would be clearer.

# Development
## Development environment setup
Get yourself a Flickr api key and secret. Add those inside Vagrantfile on the lines which specify FLICKR_ACCESS_TOKEN and FLICKR_ACCESS_TOKEN_SECRET, respectively, in the second pair of quotes.

Find out the NSID formatted user id of the flickr account where your photos are. Add that inside Vagrantfile on the line that specifies FLICKR_USER_ID in the second pair of quotes. You can use a tool such as [idGettr](http://idgettr.com/) to find your nsid.

For easy development environment setup, the project has a vagrantfile. To get started, just install [Vagrant](https://www.vagrantup.com/) and [VirtualBox](https://www.virtualbox.org/) on your machine. Then clone this repository, and navigate to the cloned project directory. Run `vagrant up` in that directory.
After these steps you will have a fully configured virtual machine with node and postgres, with all npm dependencies installed and database tables configured. You can access the virtual machine's terminal with `vagrant ssh`.
To get file change tracking to work with vagrant, install vagrant-notify-forwarder by running `vagrant plugin install vagrant-notify-forwarder`.

## Database operations
To reset the database, you can run `npm run reset-database`. This will delete the old database and recreate the database and the tables.
To create some fake data for testing, you can run `npm run create-fake-data`. This will insert some entries to the tables.
To access a postgresql shell, run `npm run psql`.
To fetch photos from flickr, you can run `npm run load-photos`.

## Running the app
To start the app, just run `npm start`. This will run the bundler and then start the server. For development convenience you can run `npm run watch` to have the server restart when changes occur in the source directory.

# Configuring the application for a new event
You will need to set the following environment variables in your server:
- HOST: the domain name of the server. This is used for cors
- PORT: the port to listen to (will default to 3000 if not specified)
- DATABASE_URL: the connection url to the backend database
- FLICKR_ACCESS_TOKEN, FLICKR_ACCESS_TOKEN_SECRET: Flickr access token and secret. You can get yours from flickr: https://www.flickr.com/services/api/keys/
- FLICKR_USER_ID: The NSID formatted user id of the Flickr account where the photos will be loaded. You can use a tool such as [idGettr](http://idgettr.com/) to find your nsid.

Also set the required newrelic environment variables, as described here: https://docs.newrelic.com/docs/agents/nodejs-agent/installation-configuration/nodejs-agent-configuration.

Then, to configure the frontend, modify the values found in `src/client/config.js`. You can set the start date and duration of the event, as well as where the map will be centered initially. You can also set a map overlay, which is a picture that is laid over the map at a specified area. You can fine tune its location by adjusting the north-eastern and south-western corner coordinates. You can also set the entire imageOverlay object to null or undefined to omit the overlay entirely.

To merge photosets you can define photoset groups in `load-photos.js`. You will need to specify an id for the group (any unique string will do), a title for it in Finnish, Swedish and English, and all the photosets that will be included. A photoset can be included in many groups. If a photoset is included in a group, it will not be shown in the frontend, instead the group will be shown.

After the configuration has been made, running `npm run load-photos` will fetch the photo info from Flickr to the local database.
