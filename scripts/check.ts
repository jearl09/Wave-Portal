import { ethers } from "hardhat";

async function main() {
    // PASTE THE ADDRESS FROM YOUR PAGE.TSX HERE
    const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

    console.log("Checking address:", address);
    const code = await ethers.provider.getCode(address);

    if (code === "0x") {
        console.log("❌ FAILURE: No contract found at this address on Localhost.");
    } else {
        console.log("✅ SUCCESS: Contract found! The backend is working.");
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});