import { ethers } from "hardhat";

async function main() {
    // 1. The address you just got from the deployment
    const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    // 2. Get the "shape" of the contract so our code knows what functions exist
    const Wave = await ethers.getContractFactory("Wave");
    const waveContract = Wave.attach(CONTRACT_ADDRESS);

    // 3. READ: Get the current message from the blockchain
    let currentMessage = await waveContract.message();
    console.log("📢 Current Message on Blockchain:", currentMessage);

    // 4. WRITE: Send a transaction to change the message
    console.log("👋 Sending a wave...");
    const tx = await waveContract.waveAtMe("Earl was here! 🚀");
    
    // Wait for the transaction to be "mined" (processed by the network)
    await tx.wait(); 

    // 5. READ: Verify it changed
    currentMessage = await waveContract.message();
    console.log("✅ New Message on Blockchain:", currentMessage);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});