// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // Deploy the contract on the blockchain
  const ContractFactory = await hre.ethers.getContractFactory("MiniflixSubscriptionCards");
  const contract = await ContractFactory.deploy();
  await contract.deployed();
  console.log("MiniflixSubscriptionCards deployed to:", contract.address);

  // Verify the contract on Etherscan
  console.log(`Verify with: $ npx hardhat verify --network CHANGE_ME ${contract.address}`)

  // Mint a few NFTs

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


/**
* Verify a smart contract on Etherscan.
* @param {*} networkName the name of the network (localhost, rinkeby, etc.)
* @param {*} contract the deployed smart contract
*/
function verifyContract(networkName, contract) {
  if (networkName !== "localhost") {
    if (contract.args) {
      console.log(`Verify with: $ npx hardhat verify --network ${networkName} ${contract.address} ${contract.args.toString().replace(/,/g, " ")}`)
    } else {
      console.log(`Verify with: $ npx hardhat verify --network ${networkName} ${contract.address}`)
    }
  }
}

