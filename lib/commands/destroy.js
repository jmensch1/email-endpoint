
const DB = require('../db'),
      { execCmd } = require('../util'),
      config = require('../../config');

const CLAUDIA     = config.claudiaCmd;
const ROOT_DIR    = config.rootDir;
const CONFIGS_DIR = config.configsDir;

module.exports = name => {
  if (!name) {
    console.log('You must provide a name to destroy an endpoint, e.g. "email-endpoint destroy myEndpoint".');
    console.log('Run "email-endpoint list" to see the names of your endpoints.');
    return;
  }

  DB.list().then(endpoints => {
    if (!endpoints[name]) {
      console.log(`Endpoint "${name}" not found.`);
      return;
    }

    let cmd = `${CLAUDIA} destroy --config ${CONFIGS_DIR}/${name}.json`;

    execCmd(cmd, { cwd: ROOT_DIR })
      .then(() => DB.del(name))
      .then(() => console.log(`Endpoint ${name} destroyed.`));
  });
};