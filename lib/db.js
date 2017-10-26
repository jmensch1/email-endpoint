
// a key-value store with insert, delete, and list functions
// uses a file to store the data

/////////////////////// IMPORTS ////////////////////////

const fs = require('fs'),
      path = require('path');

/////////////////////// CONFIG /////////////////////////

const DATA_DIR = path.join(__dirname, '../data')
const DB_FILE = path.join(DATA_DIR, 'db.json');

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

function insert(key, value) {
  return updateFile(DB_FILE, data => data[key] = value);
}

function del(key) {
  return updateFile(DB_FILE, data => delete data[key]);
}

function list() {
  return getFileContents(DB_FILE);
}

//////////////////////// INIT ///////////////////////////

if (!fs.existsSync(DATA_DIR))
  fs.mkdirSync(DATA_DIR);

if (!fs.existsSync(DB_FILE))
  fs.writeFileSync(DB_FILE, '{}');

/////////////////////// EXPORTS /////////////////////////

module.exports = {
  insert,
  del,
  list
}

