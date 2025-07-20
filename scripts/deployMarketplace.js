const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying Marketplace with account:", deployer.address);

  const bookNFTAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // BookNFT
  const bookyTokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // BOOKY

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



