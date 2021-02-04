// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.2 <0.8.0;

contract NXTokenStructs {
      struct NXToken {
        uint tokenId;
        address nxTokenHolder;
        uint8 numOfPermissions;
        uint expiration;
    }
}