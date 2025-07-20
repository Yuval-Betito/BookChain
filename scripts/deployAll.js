const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer, secondAccount] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const BookNFT = await hre.ethers.getContractFactory("BookNFT");
  const bookNFT = await BookNFT.deploy();
  await bookNFT.waitForDeployment();
  const bookNFTAddress = await bookNFT.getAddress();
  console.log("BookNFT deployed to:", bookNFTAddress);

  const BookyToken = await hre.ethers.getContractFactory("BookyToken");
  const bookyToken = await BookyToken.deploy();
  await bookyToken.waitForDeployment();
  const bookyTokenAddress = await bookyToken.getAddress();
  console.log("BookyToken deployed to:", bookyTokenAddress);

  // Transfer 100 BOOKY tokens to second account
  const transferAmount = hre.ethers.parseEther("100");
  await bookyToken.transfer(secondAccount.address, transferAmount);
  console.log(`Transferred 100 BOOKY to: ${secondAccount.address}`);

  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(bookNFTAddress, bookyTokenAddress);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("Marketplace deployed to:", marketplaceAddress);

  //  Save to .env for create-react-app (REACT_APP_ prefix)
  const envContent = `REACT_APP_BOOK_ADDRESS=${bookNFTAddress}
REACT_APP_ERC20_ADDRESS=${bookyTokenAddress}
REACT_APP_MARKETPLACE_ADDRESS=${marketplaceAddress}
`;
  fs.writeFileSync("client/.env", envContent);

  //  Copy ABIs
  const contracts = ["BookNFT", "BookyToken", "Marketplace"];
  contracts.forEach(name => {
    const src = path.join(__dirname, `../artifacts/contracts/${name}.sol/${name}.json`);
    const dest = path.join(__dirname, `../client/src/abi/${name}.json`);
    fs.copyFileSync(src, dest);
    console.log(`Copied ABI for ${name}`);
  });

  console.log(" Deployment complete. Addresses saved to client/.env");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


