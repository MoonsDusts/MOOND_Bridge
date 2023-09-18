import { ethers } from "hardhat";

async function main() {
  const bridge = await ethers.deployContract("Bridge", [
    "0x7b826810484C8CbdD2D4D652753D961A7F12B5D7",
  ]);

  await bridge.waitForDeployment();

  console.log(`Bridge: ${bridge.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
