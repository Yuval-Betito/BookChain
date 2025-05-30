import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import Header from './Header';
import bookNFTAbi from '../abi/BookNFT.json';
import { BOOK_NFT_ADDRESS } from '../contract-address';

/**
 * ReaderDashboard component displays books owned by the connected user.
 * It fetches NFTs owned by the user and loads metadata for each one.
 */
export default function ReaderDashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserBooks();
  }, []);

  /**
   * Loads books (NFTs) owned by the connected user and fetches their metadata.
   */
  const loadUserBooks = async () => {
    try {
      if (!window.ethereum) throw new Error('MetaMask not detected');
      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const userAddress = accounts[0];

      const contract = new web3.eth.Contract(bookNFTAbi.abi, BOOK_NFT_ADDRESS);
      const totalSupply = await contract.methods.totalSupply().call();

      const ownedBooks = [];

      for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
        try {
          const owner = await contract.methods.ownerOf(tokenId).call();

          if (owner.toLowerCase() === userAddress.toLowerCase()) {
            const tokenURI = await contract.methods.tokenURI(tokenId).call();
            const fullURI = tokenURI.startsWith('http') ? tokenURI : window.location.origin + tokenURI;
            const response = await fetch(fullURI);
            const metadata = await response.json();

            ownedBooks.push({
              id: tokenId,
              title: metadata.title,
              author: metadata.author,
              image: metadata.image,
            });
          }
        } catch {}
      }

      setBooks(ownedBooks);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <Header />
      <h1 className="text-center text-4xl font-bold text-yellow-400 my-8">BookChain<br />Reader Dashboard</h1>
      {loading ? (
        <p className="text-center">Loading your books...</p>
      ) : (
        <div className="flex flex-col items-center gap-4 px-4">
          {books.length === 0 ? (
            <p className="text-center text-gray-400">You do not own any books yet.</p>
          ) : (
            books.map((book) => (
              <div key={book.id} className="bg-[#0f111c] p-4 rounded-xl w-full max-w-xl shadow-md">
                <img src={book.image} alt={`Cover of ${book.title}`} className="w-20 h-20 object-cover mb-2" />
                <h2 className="text-xl font-bold text-yellow-400">{book.title}</h2>
                <p>Author: {book.author}</p>
                <p>Token ID: {book.id}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}




