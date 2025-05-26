const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying Marketplace with account:", deployer.address);

  const bookNFTAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"; // BookNFT
  const bookyTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // BOOKY

  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(bookNFTAddress, bookyTokenAddress);

  console.log("Marketplace deployed to:", await marketplace.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });

