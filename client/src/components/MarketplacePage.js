import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import Header from './Header';
import bookNFTAbi from '../abi/BookNFT.json';
import marketplaceAbi from '../abi/Marketplace.json';
import { BOOK_NFT_ADDRESS } from '../addresses';
import { MARKETPLACE_ADDRESS } from '../addresses';

/**
 * Marketplace page to display all listed books for sale and allow users to buy them using BOOKY tokens.
 */
export default function MarketplacePage() {
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadListings();
  }, []);

  /**
   * Loads all book NFTs that are listed for sale from the Marketplace contract.
   */
  const loadListings = async () => {
    try {
      if (!window.ethereum) throw new Error('MetaMask not detected');
      const web3 = new Web3(window.ethereum);
      const nftContract = new web3.eth.Contract(bookNFTAbi.abi, BOOK_NFT_ADDRESS);
      const marketplace = new web3.eth.Contract(marketplaceAbi.abi, MARKETPLACE_ADDRESS);

      const total = await nftContract.methods.totalSupply().call();
      const listings = [];

      for (let i = 0; i < total; i++) {
        try {
          const listing = await marketplace.methods.getListing(i).call();
          if (listing.price > 0) {
            const book = await nftContract.methods.getBook(i).call();
            listings.push({
              tokenId: i,
              title: book.title,
              author: book.author,
              image: book.coverImageURI,
              price: web3.utils.fromWei(listing.price, 'ether'),
            });
          }
        } catch {}
      }

      setBooks(listings);
    } catch (err) {
      setMessage('Error loading listings');
    }
  };

  /**
   * Handles purchasing a book by approving and calling the Marketplace contract.
   * @param {number} tokenId - The ID of the token to purchase.
   * @param {string} priceInEther - The price of the book in BOOKY tokens (ETH format).
   */
  const handleBuy = async (tokenId, priceInEther) => {
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();

      const marketplace = new web3.eth.Contract(marketplaceAbi.abi, MARKETPLACE_ADDRESS);
      const booky = new web3.eth.Contract(
        (await import('../abi/BookyToken.json')).default.abi,
        (await import('../addresses')).BOOKY_TOKEN_ADDRESS
      );

      const priceInWei = web3.utils.toWei(priceInEther, 'ether');
      await booky.methods.approve(MARKETPLACE_ADDRESS, priceInWei).send({ from: accounts[0] });
      await marketplace.methods.purchaseBook(tokenId).send({ from: accounts[0] });

      setMessage('Purchase successful!');
      await loadListings();
    } catch (err) {
      setMessage('Purchase failed: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="text-center pt-6">
        <h1 className="text-4xl font-bold text-yellow-400 mb-2">BookChain</h1>
        <h2 className="text-2xl font-semibold text-white mb-8">Marketplace</h2>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        {message && <p className="text-yellow-300 mb-4 text-center">{message}</p>}
        {books.length === 0 ? (
          <p className="text-center text-gray-400">No books listed for sale.</p>
        ) : (
          books.map((book) => (
            <div key={book.tokenId} className="flex items-center bg-gray-900 p-4 rounded-lg mb-4 shadow">
              <img src={book.image} alt={book.title} className="w-24 h-auto rounded mr-4" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-yellow-400">{book.title}</h3>
                <p className="text-gray-300">Author: {book.author}</p>
                <p className="text-gray-400">Price: {book.price} BOOKY</p>
              </div>
              <button
                onClick={() => handleBuy(book.tokenId, book.price)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded ml-4"
              >
                Buy
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}








