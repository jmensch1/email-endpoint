
const path = require('path');
const os = require('os');

const DATA_DIR = os.homedir() ?
                 path.join(os.homedir(), '.npm-email-endpoint') :
                 path.join(__dirname, './data');

module.exports = {
  claudiaCmd: 'npm run claudia --',

  dataDir:    DATA_DIR,
  appDir:     DATA_DIR + '/app',
  appFile:    'index',
  configsDir: DATA_DIR + '/configs',
  dbFile:     DATA_DIR + '/db.json'
}