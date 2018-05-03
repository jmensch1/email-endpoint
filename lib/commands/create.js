
/////////////////////// IMPORTS ////////////////////////

const fs = require('fs'),
      path = require('path'),
      prompt = require('prompt'),
      { execCmd } = require('../util'),
      config = require('../../config'),
      DB = require('../db');

////////////////////// CONSTANTS ///////////////////////

const CLAUDIA     = config.claudiaCmd;
const ROOT_DIR    = config.rootDir;
const APP_DIR     = config.appDir;
const APP_FILE    = config.appFile;
const CONFIGS_DIR = config.configsDir;

////////////////// PRIVATE FUNCTIONS ///////////////////

function getConfig(cb) {
  prompt.message = '';
  prompt.delimiter = '';
  prompt.colors = false;

  let configProps = [{
    name: 'name',
    description: 'Enter a name for the endpoint:',
    required: true,
    message: 'You must enter a name.'
  },{
    name: 'email',
    description: 'Enter the email you want to use:',
    required: true,
    message: 'You must enter an email.'
  },{
    name: 'apiKey',
    description: 'Enter your Sendgrid api key:',
    required: true,
    message: 'You must enter an api key.'
  },{
    name: 'region',
    description: 'Enter the AWS region to use:',
    required: false,
    default: 'us-east-1'
  }];

  prompt.start();
  prompt.get(configProps, (err, config) => {
    if (err)
      console.log('\nAborting endpoint creation.');
    else
      cb(config);
  });
};

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

function generateEndpoint(name, email, apiKey, region) {
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

    // have to run 'npm install' here because it
    // doesn't work in the prepare script
    let npmInstallOnce = (
      fs.existsSync(APP_DIR + '/node_modules') ?
      Promise.resolve() :
      execCmd('npm install', { cwd: APP_DIR }, false)
    );

    npmInstallOnce.then(() => {
      // https://github.com/claudiajs/claudia/blob/master/docs/create.md
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

      execCmd(cmd, { cwd: ROOT_DIR }).then(stdout => {
        let url = stdout.match(/"url":\s"(.*?)"/)[1];
        let info = { email, apiKey, region, url };
        DB.insert(name, info).then(() => console.log('\nENDPOINT:', url));
      });
    });
  });
}

////////////////// EXPORTS /////////////////////

module.exports = () => {
  getConfig(config => {
    let { name, email, apiKey, region } = config;
    generateEndpoint(name, email, apiKey, region);
  });
};
