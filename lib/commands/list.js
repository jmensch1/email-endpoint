
const DB = require('../db');

module.exports = () => {
  DB.list().then(endpoints => {
    let names = Object.keys(endpoints);

    if (!names.length) {
      console.log('There are no active endpoints. Run "email-endpoint create" to create one.');
      return;
    }

    names.forEach(name => {
      let endpoint = endpoints[name];
      console.log('---------------');
      console.log(`name:   ${name}`);
      console.log(`email:  ${endpoint.email}`);
      console.log(`apiKey: ${endpoint.apiKey}`);
      console.log(`region: ${endpoint.region}`);
      console.log(`url:    ${endpoint.url}`);
    });
    console.log('---------------');
  });
};