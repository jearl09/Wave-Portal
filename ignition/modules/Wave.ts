import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const WaveModule = buildModule("WaveModule", (m) => {
  // We are deploying the "Wave" contract and passing the starting message: "Hello Web3!"
  const wave = m.contract("Wave", ["Hello Web3!"]);

  return { wave };
});

export default WaveModule;