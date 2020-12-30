import React, { Component } from 'react';
import Web3 from 'web3';

import './App.css';
import MemoryToken from './abis/MemoryToken.json';
import Navbar from './component/Navbar';

const CARD_ARRAY = [
  {
    name: 'icon1',
    img: '/images/icon1.png'
  },
  {
    name: 'icon2',
    img: '/images/icon2.png'
  },
  {
    name: 'icon3',
    img: '/images/icon3.png'
  },
  {
    name: 'icon4',
    img: '/images/icon4.png'
  },
  {
    name: 'icon5',
    img: '/images/icon5.png'
  },
  {
    name: 'icon6',
    img: '/images/icon6.png'
  },
  {
    name: 'icon1',
    img: '/images/icon1.png'
  },
  {
    name: 'icon2',
    img: '/images/icon2.png'
  },
  {
    name: 'icon3',
    img: '/images/icon3.png'
  },
  {
    name: 'icon4',
    img: '/images/icon4.png'
  },
  {
    name: 'icon5',
    img: '/images/icon5.png'
  },
  {
    name: 'icon6',
    img: '/images/icon6.png'
  }
]

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      account: '0x0',
      token: null,
      totalSupply: 0,
      tokenURIs: [],
      cardArray: [],
      cardsChosen: [],
      cardsChosenId: [],
      cardsWon: []
    }
  }
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();

    // Put the order of the cards random
    this.setState({ cardArray: CARD_ARRAY.sort(() => 0.5 - Math.random()) });
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

      // Load Tokens
      let balanceOf = await token.methods.balanceOf(accounts[0]).call();
      for (let i = 0; i < balanceOf; i++) {
        let id = await token.methods.tokenOfOwnerByIndex(accounts[0], i).call();
        let tokenURI = await token.methods.tokenURI(id).call();
        this.setState({
          tokenURIs: [...this.state.tokenURIs, tokenURI]
        })
      }
      
    } else {
      alert('Smart contract not deployed to detected network.');
    }
  }

  chooseImage = (cardId) => {
    cardId = cardId.toString();

    if (this.state.cardsWon.includes(cardId)) {
      // Show blank white card
      return window.location.origin + '/images/white.png';
    }
    else if  (this.state.cardsChosenId.includes(cardId)) {
      // Show the front of the card with the icon
      return CARD_ARRAY[cardId].img;
    } else {
      // Show the back of the card
      return window.location.origin + '/images/blank.png';
    }
  }

  flipCard = async (cardId) => {
    let alreadyChosen = this.state.cardsChosen.length;

    // Keep track of the chosen cards
    this.setState({
      cardsChosen: [...this.state.cardsChosen, this.state.cardArray[cardId].name],
      cardsChosenId: [...this.state.cardsChosenId, cardId]
    })

    if (alreadyChosen === 1) {
      setTimeout(this.checkForMatch, 100);
    }
  }

  checkForMatch = async () => {
    const optionOneId = this.state.cardsChosenId[0];
    const optionTwoId = this.state.cardsChosenId[1];

    if (optionOneId === optionTwoId) {
      alert('You already click this card');
    } else if (this.state.cardsChosen[0] === this.state.cardsChosen[1]) {
      alert('It a match!');
      this.setState({
        cardsWon: [...this.state.cardsWon, optionOneId, optionTwoId]
      })
    } else {
      alert('No match, try again');
    }

    this.setState({
      cardsChosen: [],
      cardsChosenId: []
    })

    if (this.state.cardsWon.length === CARD_ARRAY.length) {
      alert('You win!');
    }
  }

  render() {
    return (
      <div className="App">
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1 className="d-4">Start matching now!</h1>

                <div className="grid mb-4">
                  { this.state.cardArray.map((card, key) => {
                      return(
                        <img
                          className="m-1"
                          key={key}
                          src={this.chooseImage(key)}
                          data-id={key}
                          alt="Icon"
                          onClick={(event) => {
                            let cardId = event.target.getAttribute('data-id');
                            if(!this.state.cardsWon.includes(cardId.toString())){
                              this.flipCard(cardId);
                            }
                          }}
                        />
                      )
                    })}
                </div>

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
