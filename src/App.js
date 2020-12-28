import React, { Component } from 'react';
import Web3 from 'web3';

import './App.css';
import Navbar from './component/Navbar';

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  render() {
    return (
      <div className="App">
        <Navbar />
        <h1 className="text-center mt-5">Match NFT</h1>
      </div>
    );
  }
}

export default App;
