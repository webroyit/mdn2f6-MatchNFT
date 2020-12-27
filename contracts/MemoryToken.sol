pragma solidity >=0.4.21 <0.7.0;

import "./ERC721Full.sol";

// `is` for inheritance
contract MemoryToken is ERC721Full {
    constructor() ERC721Full("Memory Token", "MEMORY") public {
    }

    
}