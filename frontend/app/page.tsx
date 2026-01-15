"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import WaveArtifact from "./contracts/Wave.json";
import LiquidBackground from "../src/components/LiquidBackground"; 

const CONTRACT_ADDRESS = "0xf70DBB24240b02b111605B73E4Ba75920913aA9B"; // Your Sepolia Address
const SEPOLIA_CHAIN_ID = "11155111"; 

export default function Home() {
  const [message, setMessage] = useState("LOADING...");
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chainId, setChainId] = useState<string>("Unknown");

  // Initial Data Fetch
  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      setChainId(network.chainId.toString());

      if (network.chainId.toString() === SEPOLIA_CHAIN_ID) {
        try {
          const contract = new ethers.Contract(CONTRACT_ADDRESS, WaveArtifact.abi, provider);
          const msg = await contract.message();
          setMessage(msg.toUpperCase()); 
        } catch (e) {
          console.error(e);
        }
      }
    };
    init();
  }, []);

  const handleWave = async () => {
    if (!newMessage) return;
    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, WaveArtifact.abi, signer);
      
      const tx = await contract.waveAtMe(newMessage);
      await tx.wait(); // Wait for blockchain confirmation
      
      setMessage(newMessage.toUpperCase());
      setNewMessage("");
    } catch (e) {
      console.error(e);
      alert("Transaction Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen text-white font-sans selection:bg-blue-500 selection:text-black">
      <LiquidBackground />

      {/* 1. HEADER - REPLICATING THE NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference">
        <div className="text-sm font-bold tracking-widest uppercase">
          Wave Portal <span className="opacity-50">©2026</span>
        </div>
        <div className="hidden md:flex gap-8 text-xs font-bold tracking-widest uppercase">
          <span className="cursor-pointer hover:opacity-50">Strategy</span>
          <span className="cursor-pointer hover:opacity-50">Identity</span>
          <span className="cursor-pointer hover:opacity-50">Digital</span>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           <span className="text-[10px] uppercase tracking-widest font-bold">Sepolia Live</span>
        </div>
      </nav>

      {/* 2. MAIN CONTENT - BIG TYPOGRAPHY */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 relative z-10 w-full">
        
        {/* The "Marquee" style text */}
        <div className="w-full max-w-4xl">
           <h1 className="text-5xl md:text-9xl font-black uppercase tracking-tighter leading-none text-center mb-12 mix-blend-overlay opacity-80 break-words">
             {message}
           </h1>
        </div>

        {/* The Interaction Box */}
        <div className="w-full max-w-md backdrop-blur-sm border-t border-white/20 pt-8 mt-8">
           <div className="flex gap-0 relative group">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="TYPE YOUR LEGACY..."
                className="w-full bg-transparent border-b-2 border-white/20 py-4 text-xl md:text-2xl font-bold uppercase placeholder:text-white/20 focus:outline-none focus:border-white transition-all"
              />
              <button 
                onClick={handleWave}
                disabled={isLoading}
                className="absolute right-0 bottom-4 text-sm font-bold uppercase tracking-widest hover:text-blue-400 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Minting..." : "Send [Enter]"}
              </button>
           </div>
           <p className="mt-4 text-[10px] text-white/40 uppercase tracking-widest text-center">
             Interaction requires 0.0001 Sepolia ETH • Gas fees apply
           </p>
        </div>

      </div>

      {/* 3. FOOTER */}
      <div className="fixed bottom-6 left-6 text-[10px] uppercase tracking-widest opacity-50 mix-blend-difference">
         Based in the Metaverse
      </div>
      <div className="fixed bottom-6 right-6 text-[10px] uppercase tracking-widest opacity-50 mix-blend-difference">
         Scroll to distort
      </div>
    </main>
  );
}