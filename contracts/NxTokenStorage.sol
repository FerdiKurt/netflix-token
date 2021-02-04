// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.2 <0.8.0;

import './NXTokenStructs.sol';

contract NXTokenStorage is NXTokenStructs {
    address public system;

    mapping(uint => NXToken) public nxTokens;
    mapping(uint => mapping(address => bool)) public allowedAddresses;
}