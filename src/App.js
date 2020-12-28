import React, { Component } from 'react';
import Web3 from 'web3';

import './App.css';
import MemoryToken from './abis/MemoryToken.json';
import Navbar from './component/Navbar';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      account: '0x0',
      token: null,
      totalSupply: 0
    }
  }
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
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

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    // Load contract
    const networkId = await web3.eth.net.getId();
    const networkData = MemoryToken.networks[networkId];

    if (networkData) {
      const abi = MemoryToken.abi;
      const address = networkData.address;

      // Create a JS version of the contract
      const token = new web3.eth.Contract(abi, address);
      this.setState({ token });

      // `call()` for reading data from blockchain
      const totalSupply = await token.methods.totalSupply().call();
      this.setState({ totalSupply });
      
    } else {
      alert('Smart contract not deployed to detected network.');
    }
  }

  render() {
    return (
      <div className="App">
        <Navbar account={this.state.account} />
        <h1 className="text-center mt-5">Match NFT</h1>
      </div>
    );
  }
}

export default App;
