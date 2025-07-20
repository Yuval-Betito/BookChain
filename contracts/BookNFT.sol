// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BookNFT
 * @dev NFT smart contract for minting and managing book tokens with metadata.
 */
contract BookNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    struct BookMetadata {
        string title;
        string author;
        string coverImageURI;
    }

    mapping(uint256 => BookMetadata) public bookDetails;

    event BookMinted(address indexed to, uint256 tokenId, string title, string author);

    /**
     * @dev Initializes the contract with token name and symbol.
     */
    constructor() ERC721("BookNFT", "BOOK") Ownable(msg.sender) {}

    /**
     * @dev Mints a new Book NFT to the specified address.
     * @param to The recipient address.
     * @param title The title of the book.
     * @param author The author of the book.
     * @param coverImageURI URI to the book's cover image.
     * @param tokenURI URI to the full metadata JSON.
     * @return tokenId The ID of the newly minted token.
     */
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

    /**
     * @dev Returns the metadata of a given token ID.
     * @param tokenId The token ID to query.
     * @return BookMetadata struct containing title, author, and cover image URI.
     */
    function getBook(uint256 tokenId) public view returns (BookMetadata memory) {
        require(ownerOf(tokenId) != address(0), "Book does not exist.");
        return bookDetails[tokenId];
    }

    /**
     * @dev Returns the total number of tokens minted so far.
     * @return Total minted supply (next token ID).
     */
    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    }
}


