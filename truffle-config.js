const HDWalletProvider = require('@truffle/hdwallet-provider');
//require('dotenv').config();
//const fs = require('fs');
//var mnemonic = "humble lava green output flower citizen world gas blur siren degree uniqu"
//const privateKey = fs.readFileSync("3IGV82DXDX61F6CGP6H7QGC41R5FGSGFJC").toString().trim();
// polygon Deploy: 0x6693f9c4E2d12105E7B612f031364B3901d07D41

const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();


module.exports = {

  networks: {

   /* polygon_testnet: {  /// Mumbai testnet of Matic
      provider: () => new HDWalletProvider(mnemonic,"https://rpc-mumbai.maticvigil.com"),// "https://rpc-mumbai.maticvigil.com"), //https://rpc-mainnet.maticvigil.com/ polygon-mainnet.infura.io
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      gas: 5500000,
      gasPrice: 10000000000,  // 10 Gwei
      
      networkCheckTimeout: 5000000

    },*/

    // Binance Smart Chain (BSC)
    bsc_testnet: {
      provider: () => new HDWalletProvider(mnemonic, "https://data-seed-prebsc-1-s1.bnbchain.org:8545"), //"https://data-seed-prebsc-1-s1.binance.org:8545" 
      network_id: 97,
     // gas: 7500000,
    //  gasPrice: 10000000000, // 10 gwei,
      gasPrice: 50000000000, // 25 Gwei
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true

    },
 
     local: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
      gasPrice: 5000000000 // 5 gwei
     },  
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  //contracts_directory: './src/contracts/',
  //contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
     version: "0.8.9", // Fetch exact version from solc-bin (default: truffle's version)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
          enabled: true,
          runs: 200
        },
      }
    }
  },

   db: {
     enabled: false,
  
   }
};
