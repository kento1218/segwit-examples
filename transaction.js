var bt = require("bitcoinjs-lib")
var fs = require('fs');

const argv = require('yargs').alias('T', 'testnet').boolean('T').argv

if (argv.T) {
  var network = bt.networks.testnet
  var cointype = 1
} else {
  var network = bt.networks.bitcoin
  var cointype = 0
}

var seed = process.env.SEED
if (!seed) {
  throw new Error("no seed specified")
}

var master = bt.HDNode.fromSeedBuffer(Buffer.from(seed, 'base64'), network)

if (argv._.length < 1) {
  throw new Error("txinfo not specified")
}
var infofile = argv._[0]
var txinfo = JSON.parse(fs.readFileSync(infofile, 'utf8'))

var txb = new bt.TransactionBuilder(network)
txinfo.inputs.forEach(function(txin) {
  txb.addInput(txin.tx_hash, txin.index, null, Buffer.from(txin.pubkey_script, 'hex'))
})
txinfo.outputs.forEach(function(txout) {
  txb.addOutput(txout.address, txout.amount)
})
txinfo.inputs.forEach(function(txin, idx) {
  txin.keys.forEach(function(path) {
    var key = master.derivePath(path)

    var redeem
    var witscr
    if (txin.redeem_script) {
      redeem = Buffer.from(txin.redeem_script, 'hex')
    }
    if (txin.witness_script) {
      witscr = Buffer.from(txin.witness_script, 'hex')
    }

    txb.sign(idx, key, redeem, null, txin.amount, witscr)
  })
})

console.log(txb.build().toHex())
