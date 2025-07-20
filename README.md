# BookChain DApp

**BookChain** is a decentralized application (DApp) that allows users to mint, manage, and trade digital books as NFTs (ERC721) using a custom ERC20 token named **BOOKY**.

---

## 🚀 Features

- 📚 Mint books as NFTs (ERC721) with metadata: `title`, `author`, `cover image`
- 👤 Manage owned books in Reader Dashboard
- 🛒 Buy & sell books in the Marketplace using BOOKY tokens
- 🔐 MetaMask wallet integration for authentication & transactions
- 💽 Backend metadata server for serving book data
- 🔧 Dynamic contract addresses via `.env` file
- 🧾 Mint history based on blockchain events
- ✍️ Signature verification before viewing book metadata
- 🎨 Tailwind CSS styling and smooth animations

---

## 🛠 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Yuval-Betito/BookChain.git
cd BookChain
```

### 2. Install Dependencies

```bash
npm install
cd client
npm install
cd ..
```

### 3. Start Full Development Environment

```bash
npm run dev
```

This will:

- Start a local Hardhat blockchain
- Deploy all contracts via `scripts/deployAll.js`
- Save deployed addresses to `client/.env` file (React-compatible)
- Copy all contract ABIs to `client/src/abi`
- Launch the metadata server on `http://localhost:5000`
- Start the React app on `http://localhost:3000`

✅ Make sure MetaMask is connected to `localhost:8545`

---

## 🌐 Pages Overview

| Page             | Path            | Description                                |
|------------------|------------------|--------------------------------------------|
| Home             | `/`              | Welcome screen with navigation             |
| AuthorDashboard  | `/author`        | Mint books, manage listings                |
| ReaderDashboard  | `/reader`        | View and read purchased books              |
| Marketplace      | `/marketplace`   | Browse and purchase listed books           |

---

## 📁 Folder Structure

```
BookChain/
├── contracts/                     # Smart contracts (Solidity)
│   ├── BookNFT.sol
│   ├── BookyToken.sol
│   └── Marketplace.sol
│
├── scripts/                       # Hardhat deployment scripts
│   ├── deployBookNFT.js
│   ├── deployBookyToken.js
│   ├── deployMarketplace.js
│   └── deployAll.js              # Deploys all contracts together
│
├── client/                        # React frontend
│   ├── public/
│   │   ├── metadata/             # Book metadata JSON files
│   │   └── images/               # Book covers, logo, etc.
│   ├── src/
│   │   ├── components/           # React UI components
│   │   ├── abi/                  # Contract ABIs
│   │   ├── addresses.js          # Loads contract addresses from env
│   │   └── App.js, index.js
│   ├── server.js                 # Metadata server (Express)
│   └── .env                      # Stores deployed contract addresses
│
├── hardhat.config.js             # Hardhat configuration
└── README.md
```

---

## 🔐 Environment File (.env)

The `.env` file in the `client/` directory is automatically generated after deployment and should look like this:

```env
REACT_APP_BOOK_ADDRESS=0xYourBookNFTContract
REACT_APP_ERC20_ADDRESS=0xYourBookyTokenContract
REACT_APP_MARKETPLACE_ADDRESS=0xYourMarketplaceContract
```

These are accessed via `process.env.REACT_APP_*` in the frontend.

---

## ⚙️ Development Scripts

To run the entire environment locally with one command:

```bash
npm run dev
```

This script runs the following processes in parallel:

- `npx hardhat node`
- `npx hardhat run scripts/deployAll.js --network localhost`
- `cd client && node server.js`
- `cd client && npm start`

Requires [`concurrently`](https://www.npmjs.com/package/concurrently) to be installed.

---

## 🧠 Technologies Used

- React & React Router
- Tailwind CSS
- Solidity (ERC721, ERC20)
- Hardhat (Ethereum development environment)
- Web3.js / ethers.js
- MetaMask
- Node.js (Express server)

---

## ⚠️ Notes

- Make sure MetaMask is connected to the local Hardhat network (http://localhost:8545)
- On every restart, redeploy contracts using `deployAll.js`
- Only books with valid metadata will appear properly in the app

---

## 👤 Author

**Yuval Betito**  
🔗 [GitHub Profile](https://github.com/Yuval-Betito)

