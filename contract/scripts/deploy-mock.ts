import { ethers } from "hardhat";

async function main() {
  const mock = await ethers.deployContract("Mock");

  await mock.waitForDeployment();

  console.log(`Mock: ${mock.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
