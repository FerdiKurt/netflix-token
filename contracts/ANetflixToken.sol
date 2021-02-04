// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.2 <0.8.0;

import './ERC721.sol';
import './NXTokenStorage.sol';

abstract contract ANetflixToken is NXTokenStorage, ERC721 {
    // functions to be implemented
    function mint(
        uint _tokenId,
        address payable _nxTokenHolder, 
        uint8 _numOfPermissions, 
        uint _expiration
    )   external virtual;

    function addAddress(address _addr, uint _tokenId) external virtual;
    function removeAddress(address _addr, uint _tokenId) external virtual;  
    function burn(uint _tokenId) external virtual;

    // modifiers
    modifier onlySystem() {
        require(msg.sender == system, 'Only system!');
        _;
    }
    modifier onlyApproved(uint tokenId) {
        require(getApproved(tokenId) == msg.sender, 'Only approved accounts!');
        _;
    }
    modifier isTokenExpired(uint tokenId) {
        require(block.timestamp < nxTokens[tokenId].expiration, 'Token is expired!');
        _;
    }

    // events
    event AddressAdded(uint tokenId, address addr);
    event AddressRemoved(uint tokenId, address addr);


    function idGenerator(
        address payable _nxTokenHolder,
        string memory _password
    )   external 
        view 
        onlySystem()
        returns (uint) 
    {
        return uint(keccak256(
            abi.encode(
                _nxTokenHolder, 
                _password
            )
        ));
    }
}