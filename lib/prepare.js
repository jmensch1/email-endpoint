
//////////////// IMPORTS /////////////////

const config = require('../config'),
      fs = require('fs');

///////////////// MAIN ///////////////////

if (!fs.existsSync(config.dataDir)) {

  console.log('Created data directory:', config.dataDir);

  // generate data directory
  fs.mkdirSync(config.dataDir);
  fs.mkdirSync(config.appDir);
  fs.mkdirSync(config.configsDir);

  // create db file and package.json
  fs.writeFileSync(config.dbFile, '{}');
  fs.writeFileSync(config.appDir + '/package.json', JSON.stringify({
    "name": "email-endpoint-mailer",
    "version": "1.0.0",
    "dependencies": {
      "@sendgrid/mail": "^6.1.4",
      "claudia-api-builder": "^2.5.1"
    }
  }));

}
