# Segwit Examples

## Get Started

```
$ git clone https://github.com/kento1218/segwit-examples.git
$ cd segwit-examples
$ npm install
$ export SEED=`node gen-seed.js` # generate and save master key seed
```

## Tools

### Address Genaration
Usage:

```
$ node address.js [-T] -i <address index> [-t <type>]
```

Script runs for testnet with `-T` flag (HIGHLY RECOMMENDED). `-i` specifies HD address index. Following types are available:

- `-t normal` (default): generates P2PKH address
- `-t multisig`: generates P2SH(2-3 multisig) address
- `-t p2shsegwit`: generates P2SH(P2WPKH) address
- `-t p2shsegwit-multisig`: generates P2SH(P2WSH(2-3 multisig)) address
- `-t segwit`: generates P2WPKH address (in BIP173 format)
- `-t segwit-multisig`: generates P2WSH address (in BIP173 format)

### Transaction Signing
Describe transaction details in JSON format.

```
{
  "inputs": [
    {
      "tx_hash": "", // (in hex) required
      "index": 0,    // required

      "pubkey_script": "",  // (in hex) required
      "redeem_script": "",  // (in hex) for P2SH
      "witness_script": "", // (in hex) for P2WSH
      "amount": 0,          // (in satoshi) required if segwit

      "keys": [
        "m/44'/0'/0'/0/0" // at least one key required
      ]
    }
  ],
  "outputs": [
    {
      "address": "",  // P2PKH/P2SH/BIP173 address
      "amount": 0     // (in satoshi)
    }
  ]
}
```

Then

```
$ node transaction.js -T <JSON file path>
```

`-T` flag works as same as address.js.

## Examples

### Seed Generation

```
$ export SEED=`node gen-seed.js`
$ echo $SEED
CCT5F889l8UGarou7yQ+rqu6AzIWwxSAPv400pv/sTo=
```

### Address Generation (P2PKH)

```
$ node address.js -T -i 0                                     
Path(0): m/44'/1'/0'/0/0
-------------------------------------------------------------
Pubkey Script:
  76a914eaed2b2f10030e530ad1776e4824fc9452cf87e788ac
  OP_DUP OP_HASH160 eaed2b2f10030e530ad1776e4824fc9452cf87e7 OP_EQUALVERIFY OP_CHECKSIG
-------------------------------------------------------------
Address: n2w8XiE4PKCHSjR2QgTWh348PTyDZbTgnj
```

### Address Generation (P2SH(2-3 multisig))

```
node address.js -T -i 0 -t multisig
Path(1): m/44'/1'/1'/0/0
Path(2): m/44'/1'/2'/0/0
Path(3): m/44'/1'/3'/0/0
-------------------------------------------------------------
Redeem Script (for P2SH):
  5221026fe004ccd0ef7a0e3c3c58d1e6b38651193ca3f4f8754664d6c2a15102598f2c2103bc0a97da826610b7bea456c732b883ccdf14e155c65865f1674c28fe5da5c47821027c65efbe522e949f99f036fa3f19a61b4d8164a912dc48a72f15dd700dfd0b8b53ae
  OP_2 026fe004ccd0ef7a0e3c3c58d1e6b38651193ca3f4f8754664d6c2a15102598f2c 03bc0a97da826610b7bea456c732b883ccdf14e155c65865f1674c28fe5da5c478 027c65efbe522e949f99f036fa3f19a61b4d8164a912dc48a72f15dd700dfd0b8b OP_3 OP_CHECKMULTISIG
-------------------------------------------------------------
Pubkey Script:
  a91415b1276063a8ebe4f0de6a4eb6c3142769628a8f87
  OP_HASH160 15b1276063a8ebe4f0de6a4eb6c3142769628a8f OP_EQUAL
-------------------------------------------------------------
Address: 2MuDvQB7fyTbSweQX51WiLANugk9GU64CDS
```

### Address Generation (P2SH(P2WPKH))

```
$ node address.js -T -i 0 -t p2shsegwit
Path(0): m/49'/1'/0'/0/0
-------------------------------------------------------------
Redeem Script (for P2SH):
  0014007a16765ac671cf325a476a94c84b51ddfb1d80
  OP_0 007a16765ac671cf325a476a94c84b51ddfb1d80
-------------------------------------------------------------
Pubkey Script:
  a914298ec812ad39ef2f5cb9621ea6c148a0998cf7de87
  OP_HASH160 298ec812ad39ef2f5cb9621ea6c148a0998cf7de OP_EQUAL
-------------------------------------------------------------
Address: 2Mw2xjnRXiyqazSJzXACL2HDFF1yPWUipoA
```

### Address Generation (P2SH(P2WSH(2-3 multisig)))

```
$ node address.js -T -i 0 -t p2shsegwit-multisig
Path(1): m/49'/1'/1'/0/0
Path(2): m/49'/1'/2'/0/0
Path(3): m/49'/1'/3'/0/0
-------------------------------------------------------------
Witness Script (for P2WSH):
  522102989f0379adfdfbc2f67d1fba7d9b0ab4338443348a8a1f4a54e752fb4aa22398210378eaa0f5d81ac6138645cfe0c83a42adeb2aca4b739f7ddc2be73974e3ec18e4210231d4579a98c7319389a93c4b410584711e99ced8a6bfaef62a66991b90863a7953ae
  OP_2 02989f0379adfdfbc2f67d1fba7d9b0ab4338443348a8a1f4a54e752fb4aa22398 0378eaa0f5d81ac6138645cfe0c83a42adeb2aca4b739f7ddc2be73974e3ec18e4 0231d4579a98c7319389a93c4b410584711e99ced8a6bfaef62a66991b90863a79 OP_3 OP_CHECKMULTISIG
-------------------------------------------------------------
Redeem Script (for P2SH):
  00209496d165c38533c6c94e348b8ddb2400455f4263b4de12ae038834d1af021a51
  OP_0 9496d165c38533c6c94e348b8ddb2400455f4263b4de12ae038834d1af021a51
-------------------------------------------------------------
Pubkey Script:
  a914aaed17cf6e8a75e406726b71505471c7535a58be87
  OP_HASH160 aaed17cf6e8a75e406726b71505471c7535a58be OP_EQUAL
-------------------------------------------------------------
Address: 2N8pztQWemHvLY7MhjcSK34f7tSWqsJkAe1
```

### Address Generation (P2WPKH)

```
$ node address.js -T -i 0 -t segwit          
Path(0): m/173'/1'/0'/0/0
-------------------------------------------------------------
Pubkey Script:
  00147dc26844606849050e79c199ad24c1940be5cfd8
  OP_0 7dc26844606849050e79c199ad24c1940be5cfd8
-------------------------------------------------------------
Address: tb1q0hpxs3rqdpys2rnecxv66fxpjs97tn7ct9622w
```

### Address Generation (P2WSH(2-3 multisig))

```
$ node address.js -T -i 0 -t segwit-multisig
Path(1): m/173'/1'/1'/0/0
Path(2): m/173'/1'/2'/0/0
Path(3): m/173'/1'/3'/0/0
-------------------------------------------------------------
Witness Script (for P2WSH):
  5221031e74bf0f691c7a174b3c571ca00eb56219e19d128b04bdb659edf4f7451d34a4210335ea4da25b26e7e925911e7554b08de9d1f58fc8dae1a2e5cdb0bfcad7a9f272210380e582b0e4e3ff1221e4e3376232f0eb66492d29e8668ff500626825043de8e753ae
  OP_2 031e74bf0f691c7a174b3c571ca00eb56219e19d128b04bdb659edf4f7451d34a4 0335ea4da25b26e7e925911e7554b08de9d1f58fc8dae1a2e5cdb0bfcad7a9f272 0380e582b0e4e3ff1221e4e3376232f0eb66492d29e8668ff500626825043de8e7 OP_3 OP_CHECKMULTISIG
-------------------------------------------------------------
Pubkey Script:
  0020711117b07f726af65e45745f3e315b0b4a564e2b383570ea73326b173816489e
  OP_0 711117b07f726af65e45745f3e315b0b4a564e2b383570ea73326b173816489e
-------------------------------------------------------------
Address: tb1qwyg30vrlwf40vhj9w30nuv2mpd99vn3t8q6hp6nnxf43wwqkfz0qrhqdfs
```

### Transaction Signing (with segwit)

```
$ cat txinfo.json
{
  "inputs": [
    {
      "tx_hash": "b7ebf94f15a1e892d2964231e6fffa2712f6d05be44bd92f8f08a33f26bdb00e",
      "index": 0,

      "pubkey_script": "00147dc26844606849050e79c199ad24c1940be5cfd8",
      "amount": 4999000,

      "keys": [
        "m/173'/1'/0'/0/0"
      ]
    },
    {
      "tx_hash": "b7ebf94f15a1e892d2964231e6fffa2712f6d05be44bd92f8f08a33f26bdb00e",
      "index": 1,

      "pubkey_script": "a914298ec812ad39ef2f5cb9621ea6c148a0998cf7de87",
      "redeem_script": "0014007a16765ac671cf325a476a94c84b51ddfb1d80",
      "amount": 4999000,

      "keys": [
        "m/49'/1'/0'/0/0"
      ]
    }
  ],
  "outputs": [
    {
      "address": "n1FSUVVNW8jGoAYxXetWRfqeC42tZJ5aMp",
      "amount": 9997000
    }
  ]
}
$ node transaction.js -T txinfo.json
010000000001020eb0bd263fa3088f2fd94be45bd0f61227faffe6314296d292e8a1154ff9ebb70000000000ffffffff0eb0bd263fa3088f2fd94be45bd0f61227faffe6314296d292e8a1154ff9ebb70100000017160014007a16765ac671cf325a476a94c84b51ddfb1d80ffffffff01c88a9800000000001976a914d873623c9c15fcfbfd3de319d00f45aab9d57aaf88ac02473044022002493c833850c9efd9c860b472e171acde57dd6781aa7a31cdcf44e87adaa582022009fa0dcb4603937c75a069b5a59995f8e33d66223ff746d162b3d29fdde9c6550121034a5c57ed7acc6dd51a83bd81dae51ad736819b909eb9d09145e86ba34cce0da3024730440220566ecaf5c152937bc43b473cfb526db12987256cbf5ecf09a7703faa7c0e5bbe02204da17722218117f52c68ac9090a454274edf9a7f63caab18d875563b58e05714012102157c05e3919bced8dfdd846eaf874f5713919fa2f210131166739df9bbeb486800000000
```

See https://live.blockcypher.com/btc-testnet/tx/09934dbad8c8cbfa79bb2b43d8dde438fc5133bc9f96d11cec6f3822472f6332/

