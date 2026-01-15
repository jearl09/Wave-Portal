"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import WaveArtifact from "./contracts/Wave.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // PASTE YOUR ADDRESS HERE IF DIFFERENT
const HARDHAT_CHAIN_ID = "31337";

export default function Home() {
  const [message, setMessage] = useState("Loading...");
  const [chainId, setChainId] = useState<string>("Unknown");
  const [newMessage, setNewMessage] = useState("");

  // 1. CONNECT & CHECK NETWORK
  useEffect(() => {
    const checkConnection = async () => {
      if (!window.ethereum) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Get Network
      const network = await provider.getNetwork();
      setChainId(network.chainId.toString());

      // If we are on the WRONG network, stop here.
      if (network.chainId.toString() !== HARDHAT_CHAIN_ID) {
        setMessage("⚠️ Wrong Network Detected");
        return;
      }

      // If on the RIGHT network, fetch the message
      try {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, WaveArtifact.abi, provider);
        const currentMsg = await contract.message();
        setMessage(currentMsg);
      } catch (e) {
        setMessage("Contract not found (Did you restart the node?)");
      }
    };

    checkConnection();

    // Listen for network changes
    window.ethereum.on('chainChanged', () => window.location.reload());
  }, []);

  // 2. FORCE SWITCH NETWORK FUNCTION
  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x7a69" }], // Hex for 31337
      });
    } catch (error: any) {
      // If the network doesn't exist, add it
      if (error.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x7a69",
              chainName: "Hardhat Local",
              rpcUrls: ["http://127.0.0.1:8545"],
              nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
            },
          ],
        });
      }
    }
  };

  const handleWave = async () => {
    if (!newMessage) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, WaveArtifact.abi, signer);
    
    const tx = await contract.waveAtMe(newMessage);
    await tx.wait();
    setMessage(newMessage);
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-10 font-mono">
      <div className="border border-gray-700 p-8 rounded-xl w-full max-w-lg">
        <h1 className="text-3xl text-blue-500 font-bold mb-6">🌊 Wave Portal</h1>

        {/* ERROR BOX FOR WRONG NETWORK */}
        {chainId !== HARDHAT_CHAIN_ID && (
          <div className="bg-red-900/50 border border-red-500 p-4 rounded mb-6 text-center">
            <p className="text-red-200 mb-2">You are on Chain ID: {chainId}</p>
            <p className="font-bold mb-4">You must be on Hardhat (31337)</p>
            <button 
              onClick={switchNetwork}
              className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded"
            >
              👉 Click to Fix Network
            </button>
          </div>
        )}

        {/* MAIN APP (Only shows if network is correct) */}
        {chainId === HARDHAT_CHAIN_ID && (
          <>
            <div className="text-center mb-8">
              <p className="text-gray-400 text-xs uppercase tracking-widest">Current Message</p>
              <p className="text-2xl text-green-400 mt-2">"{message}"</p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 bg-gray-800 border border-gray-600 p-3 rounded text-white"
                placeholder="Message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                onClick={handleWave}
                className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded font-bold"
              >
                Wave
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}