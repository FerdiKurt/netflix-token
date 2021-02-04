// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.2 <0.8.0;

import './ANetflixToken.sol';

contract NetflixToken is ANetflixToken {
    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        system = msg.sender;
    }

    function mint(
        uint _tokenId,
        address payable _nxTokenHolder, 
        uint8 _numOfPermissions, 
        uint _expiration
    )   external
        override
        onlySystem()
    {
        nxTokens[_tokenId] = NXToken(
            _tokenId,
            _nxTokenHolder,
            _numOfPermissions,
            block.timestamp + _expiration * 86400
        );

        _safeMint(msg.sender, _tokenId);
        approve(_nxTokenHolder, _tokenId);
    }

    function addAddress(
        address _addr, 
        uint _tokenId
    ) 
        external 
        override
        onlyApproved(_tokenId) 
        isTokenExpired(_tokenId)
    {
        require(nxTokens[_tokenId].numOfPermissions > 0, 'Permission number exceeded!');
        
        allowedAddresses[_tokenId][_addr] = true;
        nxTokens[_tokenId].numOfPermissions--;

        emit AddressAdded(_tokenId, _addr);
    }

    function removeAddress(
        address _addr, 
        uint _tokenId
    ) 
        external 
        override
        onlyApproved(_tokenId) 
        isTokenExpired(_tokenId)
    {
        require(allowedAddresses[_tokenId][_addr] == true, 'Already falsy address to remove!');
        
        allowedAddresses[_tokenId][_addr] = false;
        nxTokens[_tokenId].numOfPermissions++;

        emit AddressRemoved(_tokenId, _addr);
    }

    function burn(uint _tokenId) external override onlySystem() {
        require(block.timestamp > nxTokens[_tokenId].expiration, "Token isn't expired");

        _burn(_tokenId);
    }

}