### Installation

To install this project on your local development environment you will need:
* Node Js ( https://nodejs.org/download/ )
* Npm     ( https://github.com/npm/npm )

### Setting up Ionic

* Install Ionic: npm install -g ionic
* Install Cordova: npm install -g cordova
* Install Bower: npm install bower
* Install Plugin cordova: cordova plugin add <plugin-package-name>
* Install Plugin ionic: ionic plugin add <plugin-package-name>

**[More here](https://github.com/rotati/wiki/wiki/Getting-Start-Mobile-Hybrid-App-with-Ionic)**

### How to run this project?

* Run command: npm install
* Install plugin: ionic state restore (use for restore all dependencies from package.json)
* Start server: ionic serve
* Add platform ios: cordova platform add ios or ionic platform add ios
* Add platform android: cordova platform add android / ionic platform add android
* Build android: ionic build android / cordova build android
* Build ios: ionic build ios / cordova build ios
* Run android: ionic run android
* Run ios: ionic run ios
* To set Environment use : gulp replace --env production / gulp replace --env development /gulp replace --env staging

* To change or add url or secret key by go to _./config/env_
