const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying BookNFT contract with account:", deployer.address);

  const BookNFT = await hre.ethers.getContractFactory("BookNFT");
  const bookNFT = await BookNFT.deploy();

  console.log("BookNFT deployed to:", await bookNFT.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
