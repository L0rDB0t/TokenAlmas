// ⚠️ Agrega la dirección del contrato luego del deploy final
const CONTRACT_ADDRESS = ""; 

const ABI = [
  "function claim() public",
  "function hasClaimed(address) public view returns (bool)"
];

let provider, signer, contract;

document.getElementById("connectButton").onclick = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      const network = await provider.getNetwork();

      if (network.chainId !== 11155111) {
        alert("Conéctate a la red Sepolia Testnet");
        return;
      }

      if (CONTRACT_ADDRESS !== "") {
        contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        document.getElementById("claimButton").disabled = false;
      }

      document.getElementById("status").innerText = "✅ Wallet conectada.";
    } catch (err) {
      console.error(err);
      document.getElementById("status").innerText = "❌ Error al conectar wallet.";
    }
  } else {
    alert("Necesitas instalar Metamask");
  }
};

document.getElementById("claimButton").onclick = async () => {
  try {
    const userAddress = await signer.getAddress();
    const claimed = await contract.hasClaimed(userAddress);
    if (claimed) {
      document.getElementById("status").innerText = "❌ Ya reclamaste tu token.";
      return;
    }

    const tx = await contract.claim();
    document.getElementById("status").innerText = "⏳ Esperando confirmación...";
    await tx.wait();
    document.getElementById("status").innerText = "✅ Token reclamado con éxito.";
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "❌ Error al reclamar token.";
  }
};
