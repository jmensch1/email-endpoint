
//////////////////// IMPORTS ////////////////////

const fs = require('fs'),
      config = require('../config');

//////////////////// CONFIG /////////////////////

const DB_FILE = config.dbFile;

//////////////// PRIVATE FUNCTIONS //////////////

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

//////////////// PUBLIC FUNCTIONS //////////////

function insert(key, value) {
  return updateFile(DB_FILE, data => data[key] = value);
}

function del(key) {
  return updateFile(DB_FILE, data => delete data[key]);
}

function list() {
  return getFileContents(DB_FILE);
}

//////////////////// EXPORTS ///////////////////

module.exports = {
  insert,
  del,
  list
};
