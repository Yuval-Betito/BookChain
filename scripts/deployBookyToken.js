const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying BookyToken with account:", deployer.address);

  const BookyToken = await hre.ethers.getContractFactory("BookyToken");
  const token = await BookyToken.deploy();

  console.log("BookyToken deployed to:", await token.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
