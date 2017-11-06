var bt = require("bitcoinjs-lib")
var rnd = require('randombytes')

const argv = require('yargs')
  .alias('T', 'testnet').alias('i', 'index').alias('t', 'type')
  .number('i').string('t').boolean('T').default('t', 'normal').argv

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

var index = argv.i
if (index === undefined) {
  throw new Error("Address index not specified")
}

var pubkeysFor = function(purpose, accounts) {
  var n = master.deriveHardened(purpose).deriveHardened(cointype)
  return accounts.map(function(ai) {
    console.log("Path(" + ai + "): m/" + purpose + "'/" + cointype + "'/" + ai + "'/0/" + index)
    return n.deriveHardened(ai).derive(0).derive(index).getPublicKeyBuffer()
  })
}

var type = argv.t
if (type === 'normal') {

  var pubkey = pubkeysFor(44, [0])[0]
  var pkscr = bt.script.pubKeyHash.output.encode(bt.crypto.hash160(pubkey))

} else if (type === 'multisig') {

  var pubkeys = pubkeysFor(44, [1, 2, 3])
  var redeem = bt.script.multisig.output.encode(2, pubkeys)
  var pkscr = bt.script.scriptHash.output.encode(bt.crypto.hash160(redeem))

} else if (type === 'p2shsegwit') {

  var pubkey = pubkeysFor(49, [0])[0]
  var redeem = bt.script.witnessPubKeyHash.output.encode(bt.crypto.hash160(pubkey))
  var pkscr = bt.script.scriptHash.output.encode(bt.crypto.hash160(redeem))

} else if (type === 'p2shsegwit-multisig') {

  var pubkeys = pubkeysFor(49, [1, 2, 3])
  var witscr = bt.script.multisig.output.encode(2, pubkeys)
  var redeem = bt.script.witnessScriptHash.output.encode(bt.crypto.sha256(witscr))
  var pkscr = bt.script.scriptHash.output.encode(bt.crypto.hash160(redeem))

} else if (type === 'segwit') {

  var pubkey = pubkeysFor(173, [0])[0]
  var pkscr = bt.script.witnessPubKeyHash.output.encode(bt.crypto.hash160(pubkey))

} else if (type === 'segwit-multisig') {

  var pubkeys = pubkeysFor(173, [1, 2, 3])
  var witscr = bt.script.multisig.output.encode(2, pubkeys)
  var pkscr = bt.script.witnessScriptHash.output.encode(bt.crypto.sha256(witscr))

}

if (witscr) {
  console.log("-------------------------------------------------------------")
  console.log("Witness Script (for P2WSH):");
  console.log("  " + witscr.toString('hex'))
  console.log("  " + bt.script.toASM(witscr))
}
if (redeem) {
  console.log("-------------------------------------------------------------")
  console.log("Redeem Script (for P2SH):");
  console.log("  " + redeem.toString('hex'))
  console.log("  " + bt.script.toASM(redeem))
}
if (pkscr) {
  console.log("-------------------------------------------------------------")
  console.log("Pubkey Script:");
  console.log("  " + pkscr.toString('hex'))
  console.log("  " + bt.script.toASM(pkscr))
  console.log("-------------------------------------------------------------")
  console.log("Address: " + bt.address.fromOutputScript(pkscr, network))
}
