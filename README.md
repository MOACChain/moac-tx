
# INSTALL
`npm install moac-tx`

# USAGE

  - [example](./examples/sendRawTxs.js)

```javascript
var Chain3 = require('chain3');
var chain3 = new Chain3();

const Transaction = require('moac-tx')
const privateKey = Buffer.from('e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109', 'hex')

const txParams = {
  nonce: '0x00',
  gasPrice: '0x09184e72a000', 
  gasLimit: '0x2710',
  to: '0x0000000000000000000000000000000000000000', 
  value: '0x00', 
  data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057'
}

const tx = new Transaction(txParams)

// EIP 155 chainId - mainnet: 99, testnet: 101
var chainId = 101;
tx.setChainId(chainid);

tx.sign(privateKey)

const serializedTx = tx.serialize()

chain3.mc.sendRawTransaction('0x'+ serializedTx.toString('hex'), function(err, hash) {
    if (!err){
        
        console.log("Succeed!: ", hash);
        return hash;
    }else{
        console.log("Chain3 error:", err.message);
        return err.message;
    }

    console.log(response);
});

```

**Note:** this package expects ECMAScript 6 (ES6) as a minimum environment. From browsers lacking ES6 support, please use a shim (like [es6-shim](https://github.com/paulmillr/es6-shim)) before including any of the builds from this repo.


# LICENSE
[MIT](./LICENSE)

# API

Creates a new MOAC transaction object.

**Parameters**

-   `data` **Buffer or Array or Object** a transaction can be initiailized with either a buffer containing the RLP serialized transaction or an array of buffers relating to each of the tx Properties, listed in order below in the exmple.Or lastly an Object containing the Properties of the transaction like in the Usage example.For Object and Arrays each of the elements can either be a Buffer, a hex-prefixed (0x) String , Number, or an object with a toBuffer method such as Bignum
    -   `data.chainId` **Number** EIP 155 chainId - mainnet: 99, ropsten: 101
    -   `data.gasLimit` **Buffer** transaction gas limit
    -   `data.gasPrice` **Buffer** transaction gas price
    -   `data.to` **Buffer** to the to address
    -   `data.nonce` **Buffer** nonce number
    -   `data.shardingFlag` **Buffer** shardingFlag, 0 - TX for MotherChain, 1 - Tx for MicroChain, default 0
    -   `data.via` **Buffer** address of the VNODE proxy, only used when shardingFlag = 1
    -   `data.data` **Buffer** this will contain the data of the message or the init of a contract
    -   `data.v` **Buffer** EC recovery ID
    -   `data.r` **Buffer** EC signature parameter
    -   `data.s` **Buffer** EC signature parameter
    -   `data.value` **Buffer** the amount of ether sent

**Properties**

-   `raw` **Buffer** The raw rlp encoded transaction

**Examples**

```javascript
var rawTx = {
  nonce: '0x00',
  gasPrice: '0x09184e72a000',
  gasLimit: '0x2710',
  to: '0x0000000000000000000000000000000000000000',
  value: '0x00',
  data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
  v: '0x1c',
  r: '0x5e1d3a76fbf824220eafc8c79ad578ad2b67d01b0c2425eb1f1347e8f50882ab',
  s: '0x5bd428537f05f9830e93792f90ea6a3e2d1ee84952dd96edbae9f658f831ab13'
};
var tx = new Transaction(rawTx);
```