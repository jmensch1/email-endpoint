
const path = require('path');
const os = require('os');

const DATA_DIR = path.join(os.homedir(), '.npm-email-endpoint');

module.exports = {
  claudiaCmd: 'npm run claudia --',
  rootDir:    __dirname,
  dataDir:    DATA_DIR,
  appDir:     DATA_DIR + '/app',
  appFile:    'index',
  configsDir: DATA_DIR + '/configs',
  dbFile:     DATA_DIR + '/db.json'
}