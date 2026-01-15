import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

// DEBUGGING: Check if the key is loaded
if (!process.env.PRIVATE_KEY) {
  console.error("❌ ERROR: PRIVATE_KEY is missing from .env file!");
} else {
  console.log("✅ PRIVATE_KEY found (Safe to proceed)");
}

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      // We are hardcoding the Public URL here to fix the "Empty String" error
      url: "https://ethereum-sepolia-rpc.publicnode.com", 
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};

export default config;