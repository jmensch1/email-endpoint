
/////////////////////// IMPORTS ////////////////////////

const fs = require('fs'),
      path = require('path'),
      exec = require('child_process').exec;

////////////////////// CONSTANTS ///////////////////////

const CLAUDIA = 'npm run claudia --';
//const APP_DIR = '/Users/jacobmensch/src/temp/hello';
const APP_DIR = path.join(__dirname, '../data');
const CONFIGS_DIR = APP_DIR + '/configs';
const DB_FILE = APP_DIR + '/db.json';

///////////////////// DB FUNCTIONS /////////////////////

function updateFile(file, updater) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err)
        reject(err);

      data = JSON.parse(data);
      updater(data);

      fs.writeFile(file, JSON.stringify(data), (err) => {
        if (err)
          reject(err);
        else
          resolve(data);
      });
    });
  });
}

function getFileContents(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err)
        reject(err);
      else
        resolve(JSON.parse(data))
    })
  })
}

//////////////////// PUBLIC FUNCTIONS ///////////////////

function insert(key, value) {
  return updateFile(DB_FILE, data => data[key] = value);
}

function del(key) {
  return updateFile(DB_FILE, data => delete data[key]);
}

function list() {
  return getFileContents(DB_FILE);
}

const DB = {
  insert, del, list
};

////////////////// PRIVATE FUNCTIONS ///////////////////

function execCmd(cmd, opts={}) {
  return new Promise((resolve, reject) => {
    let proc = exec(cmd, opts, (err, stdout, stderr) => {
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
  console.log(process.cwd());

  if (!fs.existsSync(CONFIGS_DIR))
    fs.mkdirSync(CONFIGS_DIR);

  console.log("writing appFile");

  fs.writeFileSync(
    path.join(APP_DIR, 'app.js'),
    appFile(email, apiKey)
  );

  fs.writeFileSync(
    path.join(APP_DIR, 'package.json'),
    JSON.stringify(require('../package.json'))
  );

  execCmd('npm install', { cwd: APP_DIR })
    .then(() => {

      console.log("wrote appFile and installed");

      region = region || 'us-east-1';

      let claudiaArgs = {
        'region': region,
        'api-module': 'app',
        'config': `${CONFIGS_DIR}/${name}.json`,
        'name': name,
        'description': `"Sends emails to ${email}"`,
        'source': APP_DIR,
        'use-local-dependencies': ''
      };

      let argStr = Object.keys(claudiaArgs).reduce((prev, cur) => {
        return prev + ' --' + cur + ' ' + claudiaArgs[cur];
      }, '');

      let cmd = `${CLAUDIA} create` + argStr;

      console.log("CMD:", cmd);

      execCmd(cmd, { cwd: path.join(__dirname, '../') })
        .then(stdout => {
          let url = stdout.match(/"url":\s"(.*?)"/)[1];
          let info = { email, apiKey, region, url };
          DB.insert(name, info)
            .then(() => {
              console.log('\nENDPOINT:', url);
            });
         })


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
  DB.list().then(data => {
    if (!data[name]) {
      console.log(`Endpoint ${name} not found.`);
      return;
    }

    let cmd = `${CLAUDIA} destroy --config ${CONFIGS_DIR}/${name}.json`;
    execCmd(cmd)
      .then(() => DB.del(name))
      .then(() => console.log(`Endpoint ${name} destroyed.`));
  })
}

//////////////////////// INIT ///////////////////////////

if (!fs.existsSync(APP_DIR))
  fs.mkdirSync(APP_DIR);

if (!fs.existsSync(DB_FILE))
  fs.writeFileSync(DB_FILE, '{}');

////////////////////// EXPORTS ///////////////////////

module.exports = {
  createEndpoint,
  listEndpoints,
  testEndpoint,
  destroyEndpoint
};

