// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Marketplace is Ownable {
    struct Listing {
        address seller;
        uint256 price;
    }

    IERC721 public bookNFT;
    IERC20 public bookyToken;

    mapping(uint256 => Listing) public listings;

    event BookListed(uint256 tokenId, address seller, uint256 price);
    event BookPurchased(uint256 tokenId, address buyer);

    constructor(address _bookNFT, address _bookyToken) Ownable(msg.sender) {
        bookNFT = IERC721(_bookNFT);
        bookyToken = IERC20(_bookyToken);
    }

    function listBook(uint256 tokenId, uint256 price) public {
        require(bookNFT.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(bookNFT.getApproved(tokenId) == address(this), "Marketplace not approved");

        listings[tokenId] = Listing(msg.sender, price);
        emit BookListed(tokenId, msg.sender, price);
    }

    function purchaseBook(uint256 tokenId) public {
        Listing memory listing = listings[tokenId];
        require(listing.price > 0, "Book not for sale");

        // Transfer BOOKY tokens from buyer to seller
        require(
            bookyToken.transferFrom(msg.sender, listing.seller, listing.price),
            "Payment failed"
        );

        // Transfer NFT from seller to buyer
        bookNFT.safeTransferFrom(listing.seller, msg.sender, tokenId);

        // Remove listing
        delete listings[tokenId];

        emit BookPurchased(tokenId, msg.sender);
    }

    function getListing(uint256 tokenId) public view returns (Listing memory) {
        return listings[tokenId];
    }
}


