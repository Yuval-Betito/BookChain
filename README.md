# 📚 BookChain DApp

A decentralized application (DApp) that allows authors to mint and list book NFTs, and enables readers to purchase them using BOOKY ERC20 tokens.

---

## 🔧 Tech Stack

- **Smart Contracts**: Solidity (ERC721 + ERC20)
- **Blockchain Environment**: Hardhat (localhost network)
- **Frontend**: React.js
- **Wallet**: MetaMask
- **Blockchain Communication**: Web3.js

---

## 🚀 Features

- ✍️ Authors can mint NFTs with book title, author name, and cover image
- 🪙 BOOKY ERC20 token for internal currency
- 🛒 Marketplace where books can be listed and purchased
- 👛 MetaMask integration for all blockchain transactions
- 📖 Reader Dashboard to view minted books
- 🧑‍💻 Fully local development environment (no backend server needed)

---

## 📂 Project Structure

```
bookchain-dapp/
├── contracts/              # Solidity smart contracts (BookNFT, BookyToken, Marketplace)
├── scripts/                # Deployment scripts
├── client/                 # React frontend app
│   ├── src/
│   └── public/
├── artifacts/              # Auto-generated ABI files after compiling
├── hardhat.config.js       # Hardhat configuration
```

---

## 🧪 Local Development Guide

### 1. Clone the repository

```bash
git clone https://github.com/Yuval-Betito/bookchain-dapp.git
cd bookchain-dapp
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Install frontend dependencies

```bash
cd client
npm install
```

### 4. Start Hardhat local blockchain

```bash
npx hardhat node
```

### 5. Deploy contracts

In a separate terminal, run:

```bash
npx hardhat run scripts/deployBookNFT.js --network localhost
npx hardhat run scripts/deployBookyToken.js --network localhost
npx hardhat run scripts/deployMarketplace.js --network localhost
```

### 6. Start the React frontend

```bash
cd client
npm start
```

> Open `http://localhost:3000` in your browser.

---

## ✅ Course Requirements Covered

| Requirement                               | Status |
|------------------------------------------|--------|
| ERC721 Token (NFT)                       | ✅     |
| ERC20 Token (BOOKY)                      | ✅     |
| Smart contract with logic (mapping, struct) | ✅ |
| Web3.js + React + MetaMask integration   | ✅     |
| Minting, Listing, Buying via smart contracts | ✅ |
| Local blockchain (Hardhat)               | ✅     |

---

## 👤 Author

**Yuval Betito**  
[GitHub Profile](https://github.com/Yuval-Betito)
