import React, { useState } from 'react';
import Web3 from 'web3';
import Header from './Header';
import bookNFTAbi from '../abi/BookNFT.json';
import marketplaceAbi from '../abi/Marketplace.json';
import { BOOK_NFT_ADDRESS } from '../addresses';
import { MARKETPLACE_ADDRESS } from '../addresses';

export default function AuthorDashboard() {
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');

  const handleMint = async (e) => {
    e.preventDefault();
    if (!title || !authorName || !description || !coverImage) {
      setMessage('Please fill in all fields.');
      return;
    }
    try {
      if (!window.ethereum) throw new Error('MetaMask not detected.');
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();

      const metadataResponse = await fetch('http://localhost:5000/api/saveMetadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title,
          author: authorName,
          image: '/images/' + coverImage.name,
          description: description
        })
      });

      const metadataResult = await metadataResponse.json();
      const tokenURI = metadataResult.uri;

      const contract = new web3.eth.Contract(bookNFTAbi.abi, BOOK_NFT_ADDRESS);
      await contract.methods.mintBookNFT(accounts[0], title, authorName, '/images/' + coverImage.name, tokenURI)
        .send({
          from: accounts[0],
          gas: 3000000,
          gasPrice: web3.utils.toWei('20', 'gwei'),
        });

      setMessage('Book NFT minted successfully.');
    } catch (err) {
      setMessage('Minting failed: ' + err.message);
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

      const owner = await nftContract.methods.ownerOf(tokenId).call();
      if (owner.toLowerCase() !== accounts[0].toLowerCase()) {
        setMessage('You are not the owner of this token.');
        return;
      }

      await nftContract.methods.approve(MARKETPLACE_ADDRESS, tokenId).send({ from: accounts[0] });
      const priceInWei = web3.utils.toWei(price, 'ether');

      await marketplace.methods.listBook(tokenId, priceInWei).send({ from: accounts[0] });
      setMessage('Book listed for sale successfully.');
    } catch (err) {
      setMessage('Listing failed: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="text-center pt-6">
        <h1 className="text-4xl font-bold text-yellow-400 mb-2">BookChain</h1>
        <h2 className="text-2xl font-semibold text-white mb-8">Author Dashboard</h2>
      </div>

      <div className="max-w-xl mx-auto bg-gray-900 rounded-lg shadow-lg p-8">
        <form onSubmit={handleMint} className="space-y-4">
          <Input label="Book Title" value={title} onChange={setTitle} />
          <Input label="Author Name" value={authorName} onChange={setAuthorName} />
          <Input label="Book Description" value={description} onChange={setDescription} />
          <FileInput label="Cover Image" file={coverImage} onChange={setCoverImage} />
          <Button label="Mint Book NFT" color="yellow" />
        </form>

        <form onSubmit={handleListForSale} className="mt-10 space-y-4">
          <Input label="Price (BOOKY)" value={price} onChange={setPrice} type="number" />
          <Button label="List for Sale" color="yellow" />
        </form>

        {message && (
          <p className="mt-6 text-center text-sm text-yellow-300">{message}</p>
        )}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = 'text' }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
    </div>
  );
}

function FileInput({ label, file, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <label className="w-full cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded block text-center">
        {file ? file.name : "Choose Cover Image"}
        <input type="file" onChange={(e) => onChange(e.target.files[0])} className="hidden" />
      </label>
    </div>
  );
}

function Button({ label, color = 'yellow' }) {
  const colorClass =
    color === 'yellow'
      ? 'bg-yellow-400 hover:bg-yellow-500 text-black'
      : 'bg-white text-black';
  return (
    <button
      type="submit"
      className={`w-full py-2 font-bold rounded ${colorClass} transition duration-200`}
    >
      {label}
    </button>
  );
}








































