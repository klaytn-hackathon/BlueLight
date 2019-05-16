const path = require("path");

const PrivateKeyConnector = require('connect-privkey-to-provider')
const NETWORK_ID = "1001"
const GAS_LIMIT = "20000000"
const URL = "https://api.baobab.klaytn.net:8651"
const PRIVATE_KEY = "0xfa647a4bd969ea063918964f08a3c5d9b3846b9f00485ff332067d3fb5f38d5a"

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "app/src/contracts"),

  networks: {
    klaytn: {
      provider: new PrivateKeyConnector(PRIVATE_KEY, URL),
      network_id: NETWORK_ID,
      gas: GAS_LIMIT,
      gasPrice: null,
    }
  },
  compilers: {
    solc: {
      version: "0.4.24"
    }
  }
};
