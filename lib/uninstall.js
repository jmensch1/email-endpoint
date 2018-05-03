
const config = require('../config'),
      rimraf = require('rimraf');

rimraf(config.dataDir, () => {
  console.log('Deleted:', config.dataDir);
});