import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Card from "./components/card/Card";
import './App.css';
import MiniflixSubscriptionCard from './contracts/MiniflixSubscriptionCards.json';

const aggregatorV3InterfaceABI = [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]
const CHAINLINK_MATIC_USD_PRICE_FEED_ADDRESS = "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada";
const NFT_CONTRACT_ADDRESS = "0x23B822fdc8cc12ccDbB0cDc307000e715174c644";

const API_URL = "https://miniflix-api.herokuapp.com/cards/";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState('');

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert('Make sure you have Metamask!');
      return;
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });
    if (accounts.length === 0) {
      //alert('No authorized account found');
      return;
    }
    const account = accounts[0];
    setCurrentAccount(account);

    // Setup listener! This is for the case where a user comes to our site
    // and ALREADY had their wallet connected + authorized.
    setupEventListener();
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Make sure you have Metamask!');
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length === 0) {
        //alert('No authorized account found');
        return;
      }
      const account = accounts[0];
      setCurrentAccount(account);

      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      setupEventListener();
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Make sure you have Metamask!');
        return;
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, MiniflixSubscriptionCard.abi, signer);

      // This will essentially "capture" our event when our contract throws it.
      // If you're familiar with webhooks, it's very similar to that!
      contract.on("NewNFTMinted", (from, tokenId) => {
        console.log(from, tokenId.toNumber());
        alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${NFT_CONTRACT_ADDRESS}/${tokenId.toNumber()}`);
      });
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const mintBasicTierCard = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Make sure you have Metamask!');
        return;
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      console.log(signer);

      const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, MiniflixSubscriptionCard.abi, signer);
      console.log(nftContract);

      // Get the MATIC/USD price using Chainlink data feeds
      const priceFeed = new ethers.Contract(CHAINLINK_MATIC_USD_PRICE_FEED_ADDRESS, aggregatorV3InterfaceABI, provider);
      const subscriptionUSDPrice = 10;
      let subscriptionMaticPrice;
      await priceFeed.latestRoundData()
        .then((roundData) => {
            // Do something with roundData
            let maticUSD = roundData.answer / 10**8;
            subscriptionMaticPrice =  Math.round(subscriptionUSDPrice / maticUSD);
            console.log("MATIC/USD price =", maticUSD);
            console.log("Subscription price: $", subscriptionUSDPrice, "=", 1000000000000000000 * subscriptionMaticPrice, "MATIC (WEI)");
        });

      //const overrides = { value: ethers.BigNumber.from(subscriptionMaticPrice) };
      let txn = await nftContract.mint(1, { value: subscriptionMaticPrice });
      alert('Minting, please wait...');
      await txn.wait();
      alert('NFT minted!');

      // create the nft in the database
      fetch(API_URL + '?duration=30&tier=Basic', {method: 'POST'})
        .then(resp => console.log(resp));
    } catch (error) {
      console.log(error);
      return;
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render Methods
  const renderNotConnectedContainer = () => (
    <div>
      <p>Please connect using your Metamask wallet</p>
      <button onClick={connectWallet}>Connect</button>
    </div>
  );

  const renderConnectedContainer = () => (
    <div>
      <p>You are now connected! :)</p>
      <p>I see that you haven't subscribed to our services! Wanna use our awesome platform?</p>
      <p>Here's a list of our best offers</p>
      <div className="card-container">
        <Card tier="Basic" price="10" img="baby-groot" />
        <button onClick={mintBasicTierCard}>Mint basic NFT</button>
        <Card tier="Standard" price="15" img="baby-yoda" />
        <Card tier="Premium" price="20" img="baby-spiderman" />
      </div>
    </div>
  );

  return (
    <div className="App">
      <h1>Welcome to Miniflix!</h1>
      {currentAccount === "" ? renderNotConnectedContainer() : renderConnectedContainer()}
    </div>
  );
}

export default App;
