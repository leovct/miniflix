// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";

contract PriceConsumerV3 {
    using SafeCast for int256;

    AggregatorV3Interface internal priceFeed;

    /**
     * Network: Polygon Mumbai
     * Aggregator: MATIC/USD
     * Address: 0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada
     */
    constructor() {
        priceFeed = AggregatorV3Interface(0x793914B5E04D7fe17b2F938585e0038F3c32285b);
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice() public view returns (uint) {
        (,int price,,,) = priceFeed.latestRoundData();
        return price.toUint256();
    }
}
