const argv = require('yargs').argv
console.log(require('randombytes')(argv.l || 32).toString('base64'))
