
/////////////////////// IMPORTS ////////////////////////

const fs = require('fs'),
      path = require('path'),
      exec = require('child_process').exec,
      DB = require('./db');

////////////////////// CONSTANTS ///////////////////////

const CONFIGS_DIR = 'data/configs';
const CLAUDIA = './node_modules/.bin/claudia';

////////////////// PRIVATE FUNCTIONS ///////////////////

function execCmd(cmd) {
  return new Promise((resolve, reject) => {
    let proc = exec(cmd, (err, stdout, stderr) => {
      if (err)
        reject(stderr);
      else
        resolve(stdout);
    });

    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
  })
}

function appFile(email, apiKey) {
  return `
var ApiBuilder = require('claudia-api-builder'),
    sgMail = require('@sendgrid/mail');

sgMail.setApiKey('${apiKey}');

var api = new ApiBuilder();

api.post('/', function(request) {
  let params = request.post || request.body;
  params.to = params.from = '${email}';
  return sgMail.send(params);
});

module.exports = api;

`;
}

////////////////// PUBLIC FUNCTIONS ////////////////////

function createEndpoint(name, email, apiKey, region) {
  console.log('Creating endpoint...');

  region = region || 'us-east-1';

  fs.writeFileSync(
    path.join(__dirname, '../data/app.js'),
    appFile(email, apiKey)
  );

  let claudiaArgs = {
    'region': region,
    'api-module': 'data/app',
    'config': `${CONFIGS_DIR}/${name}.json`,
    'name': name,
    'description': `"Sends emails to ${email}"`
  };

  let argStr = Object.keys(claudiaArgs).reduce((prev, cur) => {
    return prev + ' --' + cur + ' ' + claudiaArgs[cur];
  }, '');

  let cmd = `${CLAUDIA} create` + argStr;

  execCmd(cmd)
    .then(stdout => {
      let url = stdout.match(/"url":\s"(.*?)"/)[1];
      let info = { email, apiKey, region, url };
      DB.insert(name, info)
        .then(() => {
          console.log('\nENDPOINT:', url);
        });
     })
}

function listEndpoints() {
  DB.list().then(console.log);
}

function testEndpoint(name) {
  DB.list().then(data => {
    let endpoint = data[name];
    if (!endpoint) {
      console.log(`Endpoint ${name} not found.`);
    } else {
      let cmd = `
        curl \
          -H "Content-Type: application/json" \
          -X POST \
          -d '{"subject":"testing endpoint: ${name}", "text":"test email content"}' \
          ${endpoint.url}
      `;
      execCmd(cmd);
    }
  });
}

function destroyEndpoint(name) {
  let cmd = `${CLAUDIA} destroy --config ${CONFIGS_DIR}/${name}.json`;
  execCmd(cmd)
    .then(() => DB.del(name))
    .then(() => console.log(`Endpoint ${name} destroyed.`));
}

////////////////////// EXPORTS ///////////////////////

module.exports = {
  createEndpoint,
  listEndpoints,
  testEndpoint,
  destroyEndpoint
};

