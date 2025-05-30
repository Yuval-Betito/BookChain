# BookChain DApp

BookChain is a decentralized application (DApp) that allows users to mint, manage, and sell digital books as NFTs (ERC721) using a custom ERC20 token called BOOKY.

## Features

* Mint books as NFTs (ERC721) with metadata (title, author, cover image)
* Manage personal book ownership in Reader Dashboard
* List books for sale and purchase them using BOOKY tokens in Marketplace
* Wallet connection via MetaMask
* Fully styled with Tailwind CSS and includes animations

---

## Installation & Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/bookchain-dapp.git
cd bookchain-dapp
```

### 2. Install Dependencies for Client

```bash
cd client
npm install
```

### 3. Start the React App

```bash
npm start
```

Runs on: `http://localhost:3000`

### 4. Run Metadata Server

In a separate terminal:

```bash
cd client
node server.js
```

Runs on: `http://localhost:5000`

### 5. Compile & Deploy Contracts

Using Hardhat:

```bash
npx hardhat compile
npx hardhat run scripts/deployBookNFT.js --network localhost
npx hardhat run scripts/deployBookyToken.js --network localhost
npx hardhat run scripts/deployMarketplace.js --network localhost
```

Update the deployed contract addresses in:

* `client/src/contract-address.js`
* `client/src/marketplace-address.js`
* `client/src/erc20-address.js`

---

## Pages Overview

| Page            | Path           | Description                  |
| --------------- | -------------- | ---------------------------- |
| HomePage        | `/`            | Landing page with navigation |
| AuthorDashboard | `/author`      | Upload, mint, and list books |
| MarketplacePage | `/marketplace` | View and buy listed books    |
| ReaderDashboard | `/reader`      | See books owned by the user  |

---

## Technologies Used

* React + React Router
* Tailwind CSS
* Solidity (ERC721 + ERC20)
* Hardhat
* MetaMask + Web3.js
* Express (for metadata handling)

---

## Folder Structure

```
bookchain-dapp/
├── client/
│   ├── public/
│   │   ├── images/
│   │   └── metadata/
│   ├── src/
│   │   ├── components/
│   │   ├── abi/
│   │   └── ...
│   └── server.js
├── contracts/
│   ├── BookNFT.sol
│   ├── BookyToken.sol
│   └── Marketplace.sol
├── scripts/
│   ├── deployBookNFT.js
│   ├── deployBookyToken.js
│   └── deployMarketplace.js
```

---

## Important Notes

* Make sure MetaMask is connected to the same local network (e.g. Hardhat localhost).
* When refreshing, re-deploy contracts and update addresses.
* Only books with proper metadata will display in Reader Dashboard.

---



## 👤 Author

**Yuval Betito**  
[GitHub Profile](https://github.com/Yuval-Betito)
