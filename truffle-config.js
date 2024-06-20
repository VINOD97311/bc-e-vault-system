const path = require("path");
const HDWalletProvider = require('@truffle/hdwallet-provider'); // Using the correct package name

const infura_apikey = "b0fb38809be7452e89656f0471c366e0";
const mnemonic = "size alley piece zone erosion decide royal foam sentence lava erosion eyebrow";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    sepolia: {
      provider: () => new HDWalletProvider(mnemonic, `https://sepolia.infura.io/v3/${infura_apikey}`),
      network_id: 11155111, // Sepolia's network id
      gas: 3000000,
      gasPrice: 10000000000
    }
  },
  contracts_build_directory: path.join(__dirname, "client/src/contracts")
};
