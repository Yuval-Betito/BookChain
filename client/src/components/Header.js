import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { BOOKY_TOKEN_ADDRESS } from '../erc20-address';
import bookyAbi from '../abi/BookyToken.json';

export default function Header() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          await loadBalance(web3, accounts[0]);
        }
      }
    };
    init();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        await loadBalance(web3, accounts[0]);
      } catch (err) {
        console.error('User rejected wallet connection', err);
      }
    } else {
      alert('MetaMask not detected. Please install it.');
    }
  };

  const loadBalance = async (web3, address) => {
    try {
      const contract = new web3.eth.Contract(bookyAbi.abi, BOOKY_TOKEN_ADDRESS);
      const rawBalance = await contract.methods.balanceOf(address).call();
      const formatted = web3.utils.fromWei(rawBalance, 'ether');
      setBalance(parseFloat(formatted).toFixed(2));
    } catch (err) {
      console.error('Failed to load BOOKY balance:', err);
    }
  };

  return (
    <div style={headerStyle}>
      <h3>BookChain</h3>
      {account ? (
        <div style={{ textAlign: 'right' }}>
          <p>Connected: {shortAddress(account)}</p>
          <p>BOOKY Balance: {balance}</p>
        </div>
      ) : (
        <button onClick={connectWallet} style={buttonStyle}>
          Connect Wallet
        </button>
      )}
    </div>
  );
}

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '15px 30px',
  backgroundColor: '#f8f8f8',
  borderBottom: '1px solid #ccc',
  marginBottom: '30px'
};

const buttonStyle = {
  padding: '8px 16px',
  fontSize: '14px',
  cursor: 'pointer'
};

const shortAddress = (addr) => addr.slice(0, 6) + '...' + addr.slice(-4);


