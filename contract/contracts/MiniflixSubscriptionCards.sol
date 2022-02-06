// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

/**
 * @title Miniflix subscription card smart contract
 * @author leovct
 * @dev Compliant with OpenZeppelin's implementation of the ERC721 spec draft
 */
contract MiniflixSubscriptionCards is ERC721URIStorage, Ownable {
    // Use the openzeppelin library to keep track of tokenIds
    using Counters for Counters.Counter;
    // State variable that counts the number of nft minted
    Counters.Counter private _tokenIds;

    // Base URI of the backend server (metadata are stored off-chain since we'll update them over time)
    string public baseURI = 'https://miniflix-api.herokuapp.com/cards/';

    // Tier of the subscription
    enum Tier { Basic, Standard, Premium }

    event NewNFTMinted(address sender, uint256 tokenId);

    /**
     * @notice Constructor of the subscription card smart contract
     */
    constructor() ERC721("Miniflix Subscription Cards", "MSC") {
        console.log("Miniflix subscription card smart contract created");
    }

    /**
     * @notice Mint a subscription card nft
     */
    function mint() public {
        // Get the current tokenId (it starts at 0)
        uint256 newTokenId = _tokenIds.current();

        // Increment the tokenId counter for when the next nft is minted
        _tokenIds.increment();

        // Mint the nft to the sender
        _safeMint(msg.sender, newTokenId);
        console.log("Miniflix Subscription Card #%s has been minted to %s", newTokenId, msg.sender);

        // Set the nft metadata
        _setTokenURI(newTokenId, string(abi.encodePacked(baseURI, newTokenId)));
        emit NewNFTMinted(msg.sender, newTokenId);
    }

    /**
     * @notice Set the base URI
     * @param _newBaseURI new base URI
     */
    function setBaseUri(string memory _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
    }

    /**
     * @notice Override the baseURI
     */
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }
}
