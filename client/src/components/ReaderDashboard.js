import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import Header from './Header';
import bookNFTAbi from '../abi/BookNFT.json';
import { BOOK_NFT_ADDRESS } from '../contract-address';

export default function ReaderDashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      if (!window.ethereum) throw new Error('MetaMask not detected');
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const contract = new web3.eth.Contract(bookNFTAbi.abi, BOOK_NFT_ADDRESS);
      const total = await contract.methods.totalSupply().call();

      const fetchedBooks = [];
      for (let i = 0; i < total; i++) {
        const book = await contract.methods.getBook(i).call();
        fetchedBooks.push({ id: i, ...book });
      }

      setBooks(fetchedBooks);
    } catch (error) {
      console.error('Error loading books:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div style={{ maxWidth: '800px', margin: '40px auto' }}>
        <h2>Reader Dashboard</h2>
        {loading ? (
          <p>Loading books...</p>
        ) : books.length === 0 ? (
          <p>No books found.</p>
        ) : (
          books.map((book) => (
            <div key={book.id} style={bookCardStyle}>
              <img
                src={book.coverImageURI}
                alt={`Cover of ${book.title}`}
                style={{ width: '120px', height: 'auto', marginRight: '20px' }}
              />
              <div>
                <h3>{book.title}</h3>
                <p>Author: {book.author}</p>
                <p>Token ID: {book.id}</p>
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
  backgroundColor: '#f9f9f9'
};
