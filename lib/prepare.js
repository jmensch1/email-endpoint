// runs when package is installed

//////////////// IMPORTS /////////////////

const config = require('../config'),
      fs = require('fs'),
      { help } = require('./commands');

//////////////// CONSTANTS ///////////////

const DATA_DIR = config.dataDir;
const APP_DIR  = config.appDir;
const CONFIGS_DIR = config.configsDir;
const DB_FILE = config.dbFile;

///////////////// MAIN ///////////////////

if (!fs.existsSync(DATA_DIR)) {

  // generate data directory
  fs.mkdirSync(DATA_DIR);
  fs.mkdirSync(APP_DIR);
  fs.mkdirSync(CONFIGS_DIR);

  // create db file and package.json
  fs.writeFileSync(DB_FILE, '{}');
  fs.writeFileSync(APP_DIR + '/package.json', JSON.stringify({
    "name": "email-endpoint-mailer",
    "version": "1.0.0",
    "dependencies": {
      "@sendgrid/mail": "^6.1.4",
      "claudia-api-builder": "^2.5.1"
    }
  }));

}

console.log('email-endpoint installed!');
console.log(`Data will be stored here: ${DATA_DIR}.\n`);
console.log('You may now run the following commands:');
help();
