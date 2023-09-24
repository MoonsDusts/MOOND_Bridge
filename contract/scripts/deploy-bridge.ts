import { ethers } from "hardhat";

async function main() {
  const bridge = await ethers.deployContract("Bridge", [
    "0x6ca5fac496bf94345958635e6e6171dfe78f36bb",
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
