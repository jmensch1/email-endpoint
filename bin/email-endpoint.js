#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const {
  createEndpoint,
  listEndpoints,
  testEndpoint,
  destroyEndpoint
} = require('../lib/actions');

switch(argv._[0]) {
  case 'create':
    let { name, email, apiKey, region } = argv;

    if (!name)
      console.log('You must provide a non-blank name for the endpoint.');
    else if (!email)
      console.log('You must provide an email address.');
    else if (!apiKey)
      console.log('You must provide an api key');
    else
      createEndpoint(name, email, apiKey, region);

    break;

  case 'list':
    listEndpoints();
    break;

  case 'test':
    if (!argv.name)
      console.log('--name parameter is required to test an endpoint.');
    else
      testEndpoint(argv.name);
    break;

  case 'destroy':
    if (!argv.name) {
      console.log('--name parameter is required to destroy the endpoint.');
      console.log('run `email-endpoint --list` to list the names of the endpoints.');
    } else {
      destroyEndpoint(argv.name);
    }
    break;

  default:
    console.log("The first argument to email-endpoint must be 'create', 'list', 'test', or 'destroy'.");
}









