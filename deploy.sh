# Script for preparing deploy on server

sudo yum install -y epel-release yum-utils
sudo yum-config-manager --enable epel
sudo yum clean all && sudo yum update -y

# Install other prerequisites
sudo yum install -y pygpgme curl

#date
# if the output of date is wrong, please follow these instructions to install ntp
#sudo yum install -y ntp
#sudo chkconfig ntpd on
#sudo ntpdate pool.ntp.org
#sudo service ntpd start

# Add our el7 YUM repository
sudo curl --fail -sSLo /etc/yum.repos.d/passenger.repo https://oss-binaries.phusionpassenger.com/yum/definitions/el-passenger.repo

# Install Passenger + nginx
sudo yum install -y nginx passenger || sudo yum-config-manager --enable cr && sudo yum install -y nginx passenger

# Edit /etc/nginx/conf.d/passenger.conf and uncomment passenger_root, passenger_ruby and passenger_instance_registry_dir
# passenger_root /some-filename/locations.ini;
# passenger_ruby /usr/bin/ruby;
# passenger_instance_registry_dir /var/run/passenger-instreg;

passenger-config --root
passenger-config validate-install

npm install gulp-cli -g
npm install nightwatch -g
npm link nightwatch