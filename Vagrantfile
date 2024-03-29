# -*- mode: ruby -*-
# vi: set ft=ruby :

# First some installation scripts, vagrant conf itself is lower down

# The base box only has the C locale installed, these should cover most uses
$generate_locales = <<SCRIPT
locale-gen fi_FI.UTF-8
locale-gen en_US.UTF-8
SCRIPT

# Installs absolute minimun for building/running
$install_packages = <<SCRIPT
curl --silent --location https://deb.nodesource.com/setup_4.x | sudo bash -
apt-get install -y --no-install-recommends build-essential git postgresql-9.3 nodejs postgis postgresql-9.3-postgis-2.1
npm install -g npm
SCRIPT

# Some configuration changes need to be made to postgres to allow local
# logins with passwords.
$configure_postgres = <<SCRIPT
cp /vagrant/vagrant/pg_hba.conf /etc/postgresql/9.3/main/
service postgresql reload
SCRIPT

# Set the NODE_ENV environment variable, and the default login location
# This script will be run as the unprivileged development user.
$configure_dotprofile = <<SCRIPT
profile_dir=~/.profile
locale="en_US.UTF-8"

export_env_if_unset() {
  if [ -z "${!1}" ]; then
    echo "export $1=$2" >> "$profile_dir"
  fi
}

source "$profile_dir"

export_env_if_unset "NODE_ENV" "dev"
export_env_if_unset "LANG" "$locale"
export_env_if_unset "LANGUAGE" "$locale"
export_env_if_unset "LC_ALL" "$locale"
export_env_if_unset "DATABASE_URL" "postgres://vagrant:vagrant@localhost/vagrant"
export_env_if_unset "TEST_DATABASE_URL" "postgres://vagrant:vagrant@localhost/test"
export_env_if_unset "PORT" "3000"
export_env_if_unset "FLICKR_USER_ID" ""
export_env_if_unset "FLICKR_ACCESS_TOKEN" "f0054c35ad19b3f095b68170a171b2f4"
export_env_if_unset "FLICKR_ACCESS_TOKEN_SECRET" "9de084433025b0ea"

if [ $(pwd) != "/vagrant" ]; then
  echo "cd /vagrant" >> "$profile_dir"
fi
SCRIPT

# Finally install npm dependencies and setup development database.
# Vagrant mounts the project directory at /vagrant.
# This script will be run as the unprivileged development user.
$install_project = <<SCRIPT
cd /vagrant

rm -rf node_modules
npm install || exit 1

npm run reset-database || exit 1

exit 0
SCRIPT

Vagrant.configure(2) do |config|
  # The development virtual machine will run Ubuntu 14.04 Trusty Tahr
  config.vm.box = "ubuntu/trusty64"
  # Forward port 3000 into the virtual machine to be able to access
  # the software from the host
  config.vm.network "forwarded_port", guest: 3000, host: 3000
  # By default 512MB of memory is reserved for the machine, but npm requires
  # more for some operations. This proved to be enough, though it might be
  # able to survive with less.
  config.vm.provider "virtualbox" do |v|
    v.memory = 1536
  end
  # Run provisioning scripts in this order.
  config.vm.provision "shell", inline: $generate_locales
  config.vm.provision "shell", inline: $install_packages
  config.vm.provision "shell", inline: $configure_postgres
  # environment setup, npm installations and project setup need to be run
  # as the development user
  config.vm.provision "shell" do |s|
    s.privileged = false
    s.inline = $configure_dotprofile
  end
  config.vm.provision "shell" do |s|
    s.privileged = false
    s.inline = $install_project
  end
end
