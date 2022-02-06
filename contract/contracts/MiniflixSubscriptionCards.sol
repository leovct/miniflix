// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./PriceConsumer.sol";
import "hardhat/console.sol";

/**
 * @title Miniflix subscription card smart contract
 * @author leovct
 * @dev Compliant with OpenZeppelin's implementation of the ERC721 spec draft
 */
contract MiniflixSubscriptionCards is ERC721URIStorage, Ownable, PriceConsumerV3 {
    using SafeMath for uint256;

    // Use the openzeppelin library to keep track of tokenIds
    using Counters for Counters.Counter;
    // State variable that counts the number of nft minted
    Counters.Counter private _tokenIds;

    // Base URI of the backend server (metadata are stored off-chain since we'll update them over time)
    string _baseTokenURI;

    // Subscription prices in USD.
    enum Tier { Basic, Standard, Premium }
    uint256 public basicTierUSDPrice = 10;
    uint256 public standardTierUSDPrice = 15;
    uint256 public premiumTierUSDPrice = 20;

    event NewNFTMinted(address sender, uint256 tokenId);
    event SubscriptionPriceUpdated(Tier tier, uint256 newPrice);

    /**
     * @notice Constructor of the subscription card smart contract
     */
    constructor(string memory baseURI) ERC721("Miniflix Subscription Cards", "MSC") {
        setBaseURI(baseURI);
        console.log("Miniflix subscription card smart contract created");
    }

    /**
     * @notice Mint a subscription card nft
     */
    function mint(Tier _tier) public payable {
        // Get the subscription price in ETH
        /*
        uint256 ethUSD = getLatestPrice();
        uint256 subscriptionUSDPrice = getSubscriptionPrice(_tier);
        uint256 subscriptionETHPrice = subscriptionUSDPrice.mul(10 ** 16).div(ethUSD);
        */
        require(msg.value >= 1, "not enough ETH sent"); 

        // Get the current tokenId (it starts at 0)
        uint256 newTokenId = _tokenIds.current();

        // Increment the tokenId counter for when the next nft is minted
        _tokenIds.increment();

        // Mint the nft to the sender
        _safeMint(msg.sender, newTokenId);
        console.log("Miniflix Subscription Card #%s has been minted to %s", newTokenId, msg.sender);

        // Set the nft metadata
        _setTokenURI(newTokenId, string(abi.encodePacked(_baseTokenURI, newTokenId)));
        emit NewNFTMinted(msg.sender, newTokenId);
    }

    /* Base URI */

    /**
     * @notice Override the baseURI
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @notice Set the base token URI.
     * @param _newBaseTokenURI new base token URI
     */
    function setBaseURI(string memory _newBaseTokenURI) public onlyOwner {
        _baseTokenURI = _newBaseTokenURI;
    }

    /* Subscription prices */

    /**
     * @notice Return the subscription price of a tier in USD.
     * @param _tier subscription tier
     * @return the price of the subscription tier in uSD
     */
    function getSubscriptionPrice(Tier _tier) public view returns (uint256) {
        if (Tier.Basic == _tier) {
            return basicTierUSDPrice;
        } else if (Tier.Standard == _tier) {
            return standardTierUSDPrice;
        } else {
            return premiumTierUSDPrice;
        }
    }

    /**
     * @notice Update the price of a subscription tier.
     * @param _tier tier of the subscription
     * @param _newPrice new price of the subscription in USD
     */
    function updateTierSubscriptionPrice(Tier _tier, uint256 _newPrice) public onlyOwner {
        if (Tier.Basic == _tier) {
            basicTierUSDPrice = _newPrice;
        } else if (Tier.Standard == _tier) {
            standardTierUSDPrice = _newPrice;
        } else {
            premiumTierUSDPrice = _newPrice;
        }
        emit SubscriptionPriceUpdated(_tier, _newPrice);
    }
}
