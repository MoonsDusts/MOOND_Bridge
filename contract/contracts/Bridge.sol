// SPDX-License-Identifier: Apache 2.0
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IERC20Burnable.sol";

contract Bridge is Ownable {
    address public token;

    uint256 public startTimestamp;
    uint256 public burnLimit = 10 ** 18;

    uint256 constant BRIDGE_PERIOD = 28 days;

    constructor(address _token) Ownable() {
        token = _token;
    }

    event BridgeInitialized(address indexed sender, uint256 indexed amount);

    function startBridge() external onlyOwner {
        require(startTimestamp == 0, "Bridge: already started");

        startTimestamp = block.timestamp;
    }

    function bridge(uint256 amount) external {
        require(amount >= burnLimit, "Bridge: too small amount");
        require(startTimestamp > 0, "Bridge: not started yet");
        require(
            startTimestamp + BRIDGE_PERIOD >= block.timestamp,
            "Bridge: expired"
        );

        IERC20Burnable(token).transferFrom(msg.sender, address(this), amount);
        IERC20Burnable(token).burn(amount);

        emit BridgeInitialized(msg.sender, amount);
    }
}
