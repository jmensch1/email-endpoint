
/////////////////// IMPORTS //////////////////

const exec = require('child_process').exec;

/////////////// PUBLIC FUNCTIONS /////////////

function execCmd(cmd, opts={}, logOutput=true) {
  return new Promise((resolve, reject) => {
    let proc = exec(cmd, opts, (err, stdout, stderr) => {
      if (err)
        reject(stderr);
      else
        resolve(stdout);
    });

    if (logOutput) {
      proc.stdout.pipe(process.stdout);
      proc.stderr.pipe(process.stderr);
    }
  });
}

/////////////////// EXPORTS //////////////////

module.exports = {
  execCmd
};