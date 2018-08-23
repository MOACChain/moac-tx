/*
 * Generate a raw Transaction for MC transfer
 * in the MOAC network
 * 
*/

//MOAC chain3 lib to test the send action
var Chain3 = require('chain3');
var chain3 = new Chain3();


var Transaction = require('../../moac-tx/index.js');
var utils = require('../lib/moacutils.js');

//library used to compare two results.
var assert = require('assert');

//test accounts 
const taccts = require('./test_accounts.json');


/*
 * value - default is in MC, 
 * in Sha, 1 mc = 1e+18 Sha
*/
function sendTx(src, des, chainid, value){

    var txcount = chain3.mc.getTransactionCount(src["addr"]);
    console.log("Get tx account", txcount)

    //The input is in unit 'mc', convert it to sha using
    //chain3 function toSha
    // The return is a String in base 10.
    // need conver to BN
    var hexval = new utils.BN(chain3.toSha(value, 'mc'), 10);

    //Build the raw tx obj
    //note the transaction inputs should be HEX string for value
    var rawTx = {
      from: src.addr,
      nonce: utils.intToHex(txcount),
      gasPrice: utils.intToHex(30000000000),
      gasLimit: utils.intToHex(2000),
      to: des.addr, 
      value: utils.addHexPrefix(hexval.toString(16)), 
      data: '0x00',
      shardingFlag: 0
    }

    //Create the new Transaction object

    var moactx = new Transaction(rawTx);
    moactx.setChainId(chainid);


    //Get the account TX list to set the raw TX command nonce value
    //Requires the private key

    var privateKey = new Buffer(src["key"], 'hex');
    moactx.sign(privateKey);

    var cmd2 = '0x' + moactx.serialize().toString('hex');

    console.log("Send cmd:", cmd2)

    chain3.mc.sendRawTransaction(cmd2, function(err, hash) {
        if (!err){
            
            console.log("Succeed!: ", hash);
            return hash;
        }else{
            console.log("Chain3 error:", err.message);
            return err.message;
        }
    
    // console.log(response);
    console.log("Get response from MOAC node in the feedback function!")
    });

}

/*
 * display the balance value - default is in MC, 
 * in Sha, 1 mc = 1e+18 Sha
*/
function checkBal(inadd){
  var outval = chain3.mc.getBalance(inadd);
  //check input address
  return chain3.fromSha(outval.toString(),'mc');
}


//Set up the server to the MOAC node
chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:8545'));

// Display the balances
// for (i = 0; i < taccts.length; i ++)
//   console.log("Acct[",i,"]:",taccts[i].addr, chain3.mc.getTransactionCount(taccts[i].addr), checkBal(taccts[i].addr));

//Call the function, note the input value is in 'mc'
var src = taccts[0];
var des = taccts[1];

console.log("\nBefore transfer:", checkBal(src.addr), checkBal(des.addr));
var networkid = chain3.version.network;
console.log("This TX is on network ", networkid);
console.log("Gas price:", chain3.mc.gasPrice);

//send mc 
sendTx(src, des, networkid, 0.1);


return;



