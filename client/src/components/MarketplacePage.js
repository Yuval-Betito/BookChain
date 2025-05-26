import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import Header from './Header';
import bookNFTAbi from '../abi/BookNFT.json';
import marketplaceAbi from '../abi/Marketplace.json';
import { BOOK_NFT_ADDRESS } from '../contract-address';
import { MARKETPLACE_ADDRESS } from '../marketplace-address';

export default function MarketplacePage() {
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadListings();
  }, []);

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
      console.error('Error loading listings:', err);
    }
  };

  const handleBuy = async (tokenId, priceInEther) => {
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();

      const marketplace = new web3.eth.Contract(marketplaceAbi.abi, MARKETPLACE_ADDRESS);
      const booky = new web3.eth.Contract(
        (await import('../abi/BookyToken.json')).default.abi,
        (await import('../erc20-address')).BOOKY_TOKEN_ADDRESS
      );

      const priceInWei = web3.utils.toWei(priceInEther, 'ether');

      await booky.methods
        .approve(MARKETPLACE_ADDRESS, priceInWei)
        .send({ from: accounts[0] });

      await marketplace.methods
        .purchaseBook(tokenId)
        .send({ from: accounts[0] });

      setMessage('Purchase successful!');
      await loadListings();
    } catch (err) {
      console.error('Purchase failed:', err);
      setMessage(`Purchase failed: ${err.message}`);
    }
  };

  return (
    <div>
      <Header />
      <div style={{ maxWidth: '800px', margin: '40px auto' }}>
        <h2>Marketplace</h2>
        {message && <p>{message}</p>}
        {books.length === 0 ? (
          <p>No books listed for sale.</p>
        ) : (
          books.map((book) => (
            <div key={book.tokenId} style={bookCardStyle}>
              <img src={book.image} alt={book.title} style={{ width: '100px', marginRight: '20px' }} />
              <div>
                <h3>{book.title}</h3>
                <p>Author: {book.author}</p>
                <p>Price: {book.price} BOOKY</p>
                <button onClick={() => handleBuy(book.tokenId, book.price)}>Buy</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const bookCardStyle = {
  display: 'flex',
  alignItems: 'center',
  border: '1px solid #ccc',
  padding: '16px',
  marginBottom: '16px',
  borderRadius: '8px',
  backgroundColor: '#f9f9f9',
};

