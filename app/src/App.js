import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Card from "./components/card/Card";
import './App.css';

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
      console.log(signer);
    } catch (error) {
      console.log(error);
      return;
    }
  };

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
      <div class="card-container">
        <Card tier="Basic" price="10" img="baby-groot" />
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
