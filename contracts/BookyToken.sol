// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BookyToken
 * @dev ERC20 token used as the currency within the BookChain platform.
 */
contract BookyToken is ERC20, Ownable {
    /**
     * @dev Initializes the token with name and symbol, and mints initial supply to the deployer.
     */
    constructor() ERC20("Booky Token", "BOOKY") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    /**
     * @dev Allows the owner to mint new tokens to a specified address.
     * @param to The address to receive the newly minted tokens.
     * @param amount The amount of tokens to mint (in wei units).
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}




