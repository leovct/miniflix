require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require('dotenv').config();


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL;
const MNMEMONIC = process.env.MNEMONIC;
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    polygon_mumbai: {
      url: MUMBAI_RPC_URL,
      accounts: {
        mnemonic: MNMEMONIC,
      },
      saveDeployments: true
    },
  },
  etherscan: {
    apiKey: POLYGONSCAN_API_KEY
  },
};
