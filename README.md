# Match NFT

## Packages
- `@openzeppelin/contracts` a library for secure smart contract development
- `truffle-flattener` concats solidity files
- `chai` for testing
- `web3` to interact with ethereum node

## How to use `truffle-flattener`
- Run `./node_modules/.bin/truffle-flattener ./node_modules/@openzeppelin/contracts/token/ERC721/ERC721Full.sol > contracts/ERC721Full.sol` to concats solidity files
- `>` is the name of the file to be created