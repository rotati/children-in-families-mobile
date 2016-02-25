# Children in Families Child Care Case Managment Mobile Application

The Children in Families case worker mobile application can be used by in the field case workers to monitor Children in Kinship and Foster Care Cases. The Case Worker can visit the child on site and take notes on their wellbieng assessments against a set of well defined and researched domains.

NOTE: This Mobile Application needs to be used in conjuction with the [Children in Families Web Application](https://github.com/rotati/children-in-families-web)

### Installation Requirements

To install this project on your local development environment you will need:

* Node Js ( https://nodejs.org/download/ )
* Npm     ( https://github.com/npm/npm )

### Setting up Ionic

* Install Ionic: npm install -g ionic
* Install Cordova: npm install -g cordova
* Install Bower: npm install bower
* Install Plugin cordova: cordova plugin add <plugin-package-name>
* Install Plugin ionic: ionic plugin add <plugin-package-name>

**[More details available on the Rotati Consutling Wiki](https://github.com/rotati/wiki/wiki/Getting-Start-Mobile-Hybrid-App-with-Ionic)**

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

### Issue Reporting

If you experience with bugs or need further improvement, please create a new issue in the repo issue list.

### Contributing to Children in Families

Pull requests are very welcome. Before submitting a pull request, please make sure that your changes are well tested. Pull requests without tests will not be accepted.

### Authors

Children in Families is developed in partnership by [Rotati Consulting](http://www.rotati.com) and [CIF](http://www.childreninfamilies.org)

### License

Children in Families Mobile Application is released under [AGPL](http://www.gnu.org/licenses/agpl-3.0-standalone.html)
