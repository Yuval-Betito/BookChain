import React, { useState } from 'react';
import Web3 from 'web3';
import Header from './Header';
import bookNFTAbi from '../abi/BookNFT.json';
import marketplaceAbi from '../abi/Marketplace.json';
import { BOOK_NFT_ADDRESS } from '../contract-address';
import { MARKETPLACE_ADDRESS } from '../marketplace-address';

export default function AuthorDashboard() {
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');

  const handleMint = async (e) => {
    e.preventDefault();

    if (!title || !authorName || !coverImage) {
      setMessage('Please fill in all fields.');
      return;
    }

    try {
      if (!window.ethereum) throw new Error('MetaMask not detected.');

      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();

      const contract = new web3.eth.Contract(bookNFTAbi.abi, BOOK_NFT_ADDRESS);

      const coverImageURI = `https://example.com/covers/${coverImage.name}`;
      const tokenURI = `https://example.com/metadata/${title.replace(/\s+/g, '_')}.json`;

      await contract.methods
        .mintBookNFT(accounts[0], title, authorName, coverImageURI, tokenURI)
        .send({
          from: accounts[0],
          gas: 3000000,
          gasPrice: web3.utils.toWei('20', 'gwei')
        });

      setMessage('Book NFT minted successfully.');
    } catch (err) {
      console.error('Minting error:', err);
      setMessage(`Minting failed: ${err.message}`);
    }
  };

  const handleListForSale = async (e) => {
    e.preventDefault();

    if (!price) {
      setMessage('Please enter a price.');
      return;
    }

    try {
      if (!window.ethereum) throw new Error('MetaMask not detected.');

      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();

      const nftContract = new web3.eth.Contract(bookNFTAbi.abi, BOOK_NFT_ADDRESS);
      const marketplace = new web3.eth.Contract(marketplaceAbi.abi, MARKETPLACE_ADDRESS);

      const totalSupply = await nftContract.methods.totalSupply().call();
      const tokenId = parseInt(totalSupply) - 1;

      await nftContract.methods
        .approve(MARKETPLACE_ADDRESS, tokenId)
        .send({ from: accounts[0] });

      const priceInWei = web3.utils.toWei(price, 'ether');

      await marketplace.methods
        .listBook(tokenId, priceInWei)
        .send({ from: accounts[0] });

      setMessage('Book listed for sale successfully.');
    } catch (err) {
      console.error('List error:', err);
      setMessage(`Failed to list: ${err.message}`);
    }
  };

  return (
    <div>
      <Header />
      <div style={{ maxWidth: '500px', margin: '50px auto' }}>
        <h2>Author Dashboard</h2>
        <form onSubmit={handleMint}>
          <div style={{ marginBottom: '10px' }}>
            <label>Book Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Author Name:</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Cover Image:</label>
            <input
              type="file"
              onChange={(e) => setCoverImage(e.target.files[0])}
              style={inputStyle}
            />
          </div>
          <button type="submit" style={buttonStyle}>Mint Book NFT</button>
        </form>

        <form onSubmit={handleListForSale}>
          <div style={{ marginTop: '30px' }}>
            <label>Price (BOOKY):</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={inputStyle}
            />
          </div>
          <button type="submit" style={buttonStyle}>List for Sale</button>
        </form>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '8px',
  marginTop: '4px',
  boxSizing: 'border-box'
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  cursor: 'pointer',
  marginTop: '10px'
};


