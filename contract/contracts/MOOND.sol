// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MoonsDust is ERC20, Ownable {
    uint256 public MAX_TOTAL_SUPPLY = 3_300_000 * 10 ** 18;

    uint256 public BRIDGE_PERIOD = 28 days;
    uint256 public bridgeStartTime;

    constructor() ERC20("MoonsDust", "MOOND") Ownable() {}

    function startBridge() external onlyOwner {
        require(bridgeStartTime == 0, "MOOND: bridge already started");

        bridgeStartTime = block.timestamp;
    }

    function endBridge() external onlyOwner {
        require(
            bridgeStartTime + BRIDGE_PERIOD < block.timestamp,
            "MOOND: bridge not finished"
        );
        require(
            totalSupply() <= MAX_TOTAL_SUPPLY,
            "MOOND: exceed the max limit"
        );

        uint256 restAmount = MAX_TOTAL_SUPPLY - totalSupply();

        _mint(msg.sender, restAmount);
    }

    function mint(
        address[] memory to,
        uint256[] memory amount
    ) external onlyOwner {
        require(bridgeStartTime > 0, "MOOND: bridge not started yet");
        require(
            bridgeStartTime + BRIDGE_PERIOD >= block.timestamp,
            "MOOD: bridge expired"
        );
        require(to.length == amount.length, "MOOND: invalid input data");
        for (uint i = 0; i < to.length; i++) {
            address _to = to[i];
            uint256 _amount = amount[i];
            _mint(_to, _amount);
        }
    }
}
