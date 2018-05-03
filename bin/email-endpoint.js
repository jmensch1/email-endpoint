#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const { create, list, test, destroy, help } = require('../lib/commands');

switch(argv._[0]) {
  case 'create':  return create();
  case 'list':    return list();
  case 'test':    return test(argv._[1]);
  case 'destroy': return destroy(argv._[1]);
  case 'help':    return help();

  default:
    console.log("Command not recognized. These are the available commands:");
    return help();
}
