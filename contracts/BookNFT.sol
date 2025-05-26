// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BookNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    struct BookMetadata {
        string title;
        string author;
        string coverImageURI;
    }

    mapping(uint256 => BookMetadata) public bookDetails;

    event BookMinted(address indexed to, uint256 tokenId, string title, string author);

    constructor() ERC721("BookNFT", "BOOK") Ownable(msg.sender) {}

    function mintBookNFT(
        address to,
        string memory title,
        string memory author,
        string memory coverImageURI,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        bookDetails[tokenId] = BookMetadata(title, author, coverImageURI);

        emit BookMinted(to, tokenId, title, author);
        return tokenId;
    }

    function getBook(uint256 tokenId) public view returns (BookMetadata memory) {
        require(ownerOf(tokenId) != address(0), "Book does not exist.");
        return bookDetails[tokenId];
    }

    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    }
}
