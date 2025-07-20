import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { useLocation, useNavigate } from 'react-router-dom';
import { BOOKY_TOKEN_ADDRESS } from '../addresses';
import bookyAbi from '../abi/BookyToken.json';

/**
 * Header component that displays wallet connection and token balance info.
 * Also provides navigation to the homepage when not on the homepage.
 */
export default function Header() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

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

  /**
   * Connects to MetaMask wallet and loads account and balance.
   */
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

  /**
   * Loads BOOKY token balance for given address.
   * @param {Web3} web3 - Web3 instance.
   * @param {string} address - Wallet address.
   */
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

  /**
   * Shortens a wallet address for display.
   * @param {string} addr - Wallet address.
   * @returns {string}
   */
  const shortAddress = (addr) => addr.slice(0, 6) + '...' + addr.slice(-4);

  const isHomePage = location.pathname === '/' || location.pathname === '/home';

  return (
    <header className="bg-black text-white py-4 shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {!isHomePage ? (
          <button
            onClick={() => navigate('/')}
            className="text-yellow-400 hover:underline font-medium"
          >
            Back to Home
          </button>
        ) : (
          <div></div>
        )}

        {account ? (
          <div className="text-right text-sm text-gray-200">
            <p>Connected: <span className="text-yellow-300">{shortAddress(account)}</span></p>
            <p>BOOKY Balance: <span className="text-yellow-300">{balance}</span></p>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded transition duration-200"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}








