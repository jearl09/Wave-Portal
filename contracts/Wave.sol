// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Wave {
    // 1. A variable to store a message on the blockchain
    string public message;
    
    // 2. A counter to track how many waves we get
    uint256 public totalWaves;

    // 3. This runs ONCE when you deploy (like a setup function)
    constructor(string memory _initialMessage) {
        message = _initialMessage;
        totalWaves = 0;
    }

    // 4. A function anyone can call to update the message
    function waveAtMe(string memory _newMessage) public {
        message = _newMessage;
        totalWaves += 1;
    }
}