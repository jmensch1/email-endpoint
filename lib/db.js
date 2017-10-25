
/////////////////////// IMPORTS ////////////////////////

const fs = require('fs'),
      path = require('path');

/////////////////////// CONFIG /////////////////////////

const DATA_FILE = path.join(__dirname, '../data/db.json');

/////////////////// PRIVATE FUNCTIONS //////////////////

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

function insert(name, info) {
  return updateFile(DATA_FILE, data => data[name] = info);
}

function del(name) {
  return updateFile(DATA_FILE, data => delete data[name]);
}

function list() {
  return getFileContents(DATA_FILE);
}

/////////////////////// EXPORTS /////////////////////////

module.exports = {
  insert,
  del,
  list
}

