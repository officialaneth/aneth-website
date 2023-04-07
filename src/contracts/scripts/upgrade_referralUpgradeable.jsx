const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const gas = await ethers.provider.getGasPrice();

  console.log("Gas price is ", gas);

  console.log("Deploying contracts with the account:", deployer.address);
  const balance = await deployer.getBalance();
  const formatedBalance = ethers.utils.formatEther(balance);

  console.log("Account balance:", formatedBalance.toString(), "ETH");

  const TokenV2 = await ethers.getContractFactory("ReferralUpgradeable");
  const mc = await upgrades.upgradeProxy(
    "0xCCD2C4257e0D44019C4a7bA14df74A4E2A6F982E",
    TokenV2,
    { gasPrice: gas }
  );

  await mc.deployed();
  console.log("Contract Upgraded:", mc.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
