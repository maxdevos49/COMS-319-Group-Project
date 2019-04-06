#!/bin/bash
#
# Author Maxwell DeVos
# Script for generating a default .env file for the
# project. (Because they are not transfered with git)
version=1.4
set -eu

if [[ $* == --help || $* == -h ]];
then
    echo "Usage: [-f | --force] [-h | --help]"
else
    env_file=.env
    gen=0
    
    if [ -e $env_file ]; then
        gen=1;
    fi
    
    if [[ $* == --force || $* == -f || $gen != 1 ]];
    then
        cat > $env_file <<EOF
#Enviroment Variables for CS319
#generated with script v$version

#Do not commit this file!

#NODE Enviroment
NODE_ENVIROMENT=development

#Server Port
PORT=8080
DOMAIN=localhost
TRANSPORT=http

#Database
MONGODB_URI="mongodb://user:1Password@ds155634.mlab.com:55634/dev-cs319"

#Hash
HASH_SALT=5

#Session
SECRET="supersecret"
EOF
        echo ".env file was generated. Version: $version";
    else
        echo "File $env_file already exists!";
    fi
fi