
const path = require('path');
const DATA_DIR = path.join(__dirname, './data');

module.exports = {
  claudiaCmd: 'npm run claudia --',

  dataDir:    DATA_DIR,
  appDir:     DATA_DIR + '/app',
  appFile:    'index',
  configsDir: DATA_DIR + '/configs',
  dbFile:     DATA_DIR + '/db.json'
}