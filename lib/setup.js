
const fs = require('fs');

fs.mkdirSync('./data');
fs.mkdirSync('./data/configs');
fs.writeFileSync('./data/db.json', '{}');