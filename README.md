#[Modulr](http://www.modulr.io)

Open Source Framework for ERP´s Development

Before you start take a look at [http://www.modulr.io](http://www.modulr.io)

[Demo](http://ec2-52-90-181-247.compute-1.amazonaws.com:3000/)


## Table of Contents

- [Quick start](#quick-start)
- [Technologies](#technologies)
- [Pre install](#pre-install)
- [Install modulr](#install-modulr)
- [Start modulr](#start-modulr)
- [Documentation](#documentation)
- [How to contribute](#how-to-contribute)
- [Community](#community)
- [Credits](#credits)
- [License](#license)



## Quick start

Download modulr or clone the repository:

- [Download the lates version.](https://github.com/modulr/modulr/archive/master.zip)
- Clone the repository: `git clone https://github.com/modulr/modulr`.



## Technologies

Modulr uses this technologies

- [Node.js](https://nodejs.org/en/) v4.3.1 LTS tested
- [NPM](https://www.npmjs.com/) v2.14.12 tested
- [MongoDB](https://www.mongodb.org/) v3.2.3 tested
- [Gulp](http://gulpjs.com/) v3.9.1 tested
- [Bower](http://bower.io/) v1.7.7 tested
- [Sails](http://sailsjs.org/) v0.12.1 tested
- [Angular](https://angularjs.org/) v1.4.5 tested
- [Bootstrap](http://getbootstrap.com/) v3.3.5 tested
- [Git](https://git-scm.com/) v1.9.1 tested



##Pre install

####Linux (debian based)

######1. Update OS

```
$ sudo apt-get update
$ sudo apt-get upgrade
```
######2. Install basics

```
$ sudo apt-get install make
$ sudo apt-get install build-essential g++
```

######3. Most debian distros come with a pre-installed python but if not use this:

```
$ sudo add-apt-repository ppa:fkrull/deadsnakes
$ sudo apt-get update
$ sudo apt-get install python2.7
```

######4. Install git

```
$ sudo apt-get install git
```

######5. Install MongoDB

```
$ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
$ echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
$ sudo apt-get update
$ sudo apt-get install -y mongodb-org
$ sudo service mongod status
```

######6. Install NodeJS

```
$ curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
$ sudo apt-get install -y nodejs
```

######7. Install Bower

```
$ sudo npm install -g bower
```

######8. Install Gulp

```
$ sudo npm install --global gulp-cli
```

######9. Install Sails

```
$ sudo npm -g install sails
```



##Install modulr

######1. Clone the modulr repository

```
$ git clone https://github.com/modulr/modulr.git
```

######2. Install npm dependencies

```
~/modulr/api$ sudo npm install -g node-gyp
~/modulr/api$ npm install
~/modulr/app$ npm install
```

######3. Install bower dependencies

```
~/modulr/app$ bower install
```

> If you receive conflicts notifications please chose "angular#~1.4.5 which resolved to 1.4.12 and is required by modulr"

```
- Prefix the choice with ! to persist it to bower.json
- ? Answer
- angular#~1.4.5 which resolved to 1.4.12 and is required by modulr
```



##Start modulr

> First check mongo is runing, if is not you can started with:

```
$ mongod
```

######1. Configure enviroment files

```
~/modulr/api/config$ mv development.example.js development.js
~/modulr/app/config$ mv development.example.json development.json
```

######2. Start sails

```
~/modulr/api$ sails lift
```

######3. Start web server

```
~/modulr/app$ gulp serve
```

######4. Finaly step

*Go to [http://localhost:3000](http://localhost:3000) in you browser.*


##Documentation

You can find our documentation in [https://github.com/modulr/modulr/wiki](https://github.com/modulr/modulr/wiki)


##How to contribute

If you want to making changes better avoid working directly on the master branch, to avoid conflicts if you pull in updates from origin, so, if make your contribution under the branch [`developer`](https://github.com/modulr/modulr/tree/developer).

All contributions are very welcome, We love it. There are several ways to help out:

- Create an issue on GitHub, if you have found a bug
- Write test cases for open bug issues
- Write patches for open bug/feature issues, preferably with test cases included
- Contribute to the documentation

There are a few guidelines that we need contributors to follow so that we have a chance of keeping on top of things.



##Community

- Join [the official Slack room](https://modulr.slack.com/).
- Implementation help may be found at Stack Overflow (tagged [`modulr`](http://stackoverflow.com/questions/tagged/modulr)).

##Credits

- [@Alfredobarronc](https://twitter.com/alfredobarronc)
- [@mostrosonido](https://twitter.com/mostrosonido)
- [@egarmorales](https://twitter.com/egarmorales)

##License
The [MIT©](https://github.com/modulr/modulr/blob/master/LICENSE) License 2016 - Modulr.
