
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { BrowserProvider } from 'ethers';
import Header from './Header';
import bookNFTAbi from '../abi/BookNFT.json';
import marketplaceAbi from '../abi/Marketplace.json';
import { BOOK_NFT_ADDRESS, MARKETPLACE_ADDRESS } from '../addresses';

export default function ReaderDashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewedBookId, setViewedBookId] = useState(null);
  const [mintHistory, setMintHistory] = useState([]);

  useEffect(() => {
    loadUserBooks();
    loadMintHistory(); 
  }, []);

  const loadUserBooks = async () => {
    try {
      if (!window.ethereum) throw new Error('MetaMask not detected');
      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const userAddress = accounts[0];

      const nftContract = new web3.eth.Contract(bookNFTAbi.abi, BOOK_NFT_ADDRESS);
      const marketplace = new web3.eth.Contract(marketplaceAbi.abi, MARKETPLACE_ADDRESS);
      const totalSupply = await nftContract.methods.totalSupply().call();

      const ownedBooks = [];

      for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
        try {
          const owner = await nftContract.methods.ownerOf(tokenId).call();
          if (owner.toLowerCase() === userAddress.toLowerCase()) {
            const listing = await marketplace.methods.getListing(tokenId).call();
            if (listing.price > 0) continue;  // Skip books that are still for sale

            const tokenURI = await nftContract.methods.tokenURI(tokenId).call();
            const fullURI = tokenURI.startsWith('http') ? tokenURI : window.location.origin + tokenURI;
            const response = await fetch(fullURI);
            const metadata = await response.json();

            ownedBooks.push({
              id: tokenId,
              title: metadata.title,
              author: metadata.author,
              image: metadata.image,
              description: metadata.description || 'No description available.',
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

  const loadMintHistory = async () => {
    try {
      if (!window.ethereum) throw new Error('MetaMask not detected');
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(bookNFTAbi.abi, BOOK_NFT_ADDRESS);

      const events = await contract.getPastEvents("BookMinted", {
        fromBlock: 0,
        toBlock: "latest"
      });

      const history = events.map(event => ({
        user: event.returnValues.to,
        title: event.returnValues.title,
        author: event.returnValues.author,
        tokenId: event.returnValues.tokenId
      }));

      setMintHistory(history.reverse());
    } catch (err) {
      console.error("Failed to load mint history", err);
    }
  };

  const handleViewBook = async (bookId) => {
    try {
      if (!window.ethereum) {
        alert('MetaMask is not detected');
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const message = 'I confirm I am the book owner';
      await signer.signMessage(message);

      setViewedBookId(bookId);
    } catch (err) {
      console.error('Signature rejected or failed', err);
      alert('Signature rejected. Cannot view book.');
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

                <button
                  onClick={() => handleViewBook(book.id)}
                  className="mt-3 px-4 py-2 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-400 transition"
                >
                  View Book
                </button>

                {viewedBookId === book.id && (
                  <div className="mt-4 p-3 bg-[#1a1c2c] rounded text-sm text-gray-300">
                    <p><strong>Description:</strong> {book.description}</p>
                    <p><strong>Access Granted:</strong> Signed successfully</p>
                  </div>
                )}
              </div>
            ))
          )}

          {/* Mint History Section */}
          <div className="mt-12 px-4 max-w-2xl w-full">
            <h2 className="text-xl font-bold text-yellow-300 mb-4"> Mint History</h2>
            {mintHistory.length === 0 ? (
              <p className="text-gray-400">No books minted yet.</p>
            ) : (
              <ul className="space-y-2">
                {mintHistory.map((entry, index) => (
                  <li key={index} className="bg-[#1a1a2e] p-4 rounded-md">
                    <p><strong>Book:</strong> {entry.title}</p>
                    <p><strong>Author:</strong> {entry.author}</p>
                    <p><strong>Minted by:</strong> {entry.user}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}



































