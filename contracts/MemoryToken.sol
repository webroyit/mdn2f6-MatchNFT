pragma solidity >=0.4.21 <0.7.0;

import "./ERC721Full.sol";

// `is` for inheritance
contract MemoryToken is ERC721Full {
    constructor() ERC721Full("Memory Token", "MEMORY") public {
    }

    // `_to` the address of the person to send the token to
    // `_tokenURI` is the location of the image being stored
    function mint(address _to, string memory _tokenURI) public returns(bool) {
        // `totalSupply()` return the number of tokens that existed
        // `add()` to increase the number of tokens
        uint _tokenId = totalSupply().add(1);

        // Create the token
        _mint(_to, _tokenId);

        // Set the URI of the image
        _setTokenURI(_tokenId, _tokenURI);
        
        return true;
    }
}