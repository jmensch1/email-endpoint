
const DB = require('../db'),
      { execCmd } = require('../util');

module.exports = name => {
  if (!name) {
    console.log('You must provide a name to test an endpoint, e.g. "email-endpoint test myEndpoint".');
    console.log('Run "email-endpoint list" to see the names of your endpoints.');
    return;
  }

  DB.list().then(endpoints => {
    let endpoint = endpoints[name];
    if (!endpoint) {
      console.log(`Endpoint "${name}" not found.`);
    } else {
      let cmd = `
        curl \
          -H "Content-Type: application/json" \
          -X POST \
          -d '{"subject":"testing endpoint: ${name}", "text": "endpoint is working."}' \
          ${endpoint.url}
      `;
      execCmd(cmd);
    }
  });
};