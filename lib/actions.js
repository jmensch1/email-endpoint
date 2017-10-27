
/////////////////////// IMPORTS ////////////////////////

const fs = require('fs'),
      path = require('path'),
      { execCmd } = require('./util'),
      config = require('../config'),
      DB = require('./db');

////////////////////// CONSTANTS ///////////////////////

const CLAUDIA     = config.claudiaCmd;
const APP_DIR     = config.appDir;
const APP_FILE    = config.appFile;
const CONFIGS_DIR = config.configsDir;

////////////////// PRIVATE FUNCTIONS ///////////////////

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
  DB.list().then(endpoints => {
    if (endpoints[name]) {
      console.log(`Endpoint ${name} already exists. Please choose another name.`);
      return;
    }

    console.log('Creating endpoint...');

    fs.writeFileSync(
      path.join(APP_DIR, APP_FILE + '.js'),
      appFile(email, apiKey)
    );

    execCmd('npm install', { cwd: APP_DIR }, true).then(() => {
      region = region || 'us-east-1';

      let claudiaArgs = {
        'name':         name,
        'api-module':   APP_FILE,
        'source':       APP_DIR,
        'config':       `${CONFIGS_DIR}/${name}.json`,
        'description':  `"Sends emails to ${email}"`,
        'region':       region,
        'use-local-dependencies': ''
      };

      let argStr = Object.keys(claudiaArgs).reduce((prev, cur) => {
        return prev + ' --' + cur + ' ' + claudiaArgs[cur];
      }, '');

      let cmd = `${CLAUDIA} create` + argStr;

      execCmd(cmd, { cwd: path.join(__dirname, '../') }).then(stdout => {
        let url = stdout.match(/"url":\s"(.*?)"/)[1];
        let info = { email, apiKey, region, url };
        DB.insert(name, info).then(() => console.log('\nENDPOINT:', url));
      });
    });
  });
}

function listEndpoints() {
  DB.list().then(console.log);
}

function testEndpoint(name) {
  DB.list().then(endpoints => {
    let endpoint = endpoints[name];
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
  DB.list().then(endpoints => {
    if (!endpoints[name]) {
      console.log(`Endpoint ${name} not found.`);
      return;
    }

    let cmd = `${CLAUDIA} destroy --config ${CONFIGS_DIR}/${name}.json`;
    execCmd(cmd)
      .then(() => DB.del(name))
      .then(() => console.log(`Endpoint ${name} destroyed.`));
  })
}

////////////////////// EXPORTS ///////////////////////

module.exports = {
  createEndpoint,
  listEndpoints,
  testEndpoint,
  destroyEndpoint
};

