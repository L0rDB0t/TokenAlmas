// Configuración universal
const CONFIG = {
  contractAddress: "0x20ae870f101b578917fec53d4e98ef0abe0df6fc",
  tokenId: 1, // ID de tu token SFT
  tokenURI: "/1.json", // Ruta relativa al JSON
  chainId: 11155111 // Sepolia
};

// ABI simplificado
const ABI = [
  {"inputs":[
    {"internalType":"address","name":"account","type":"address"},
    {"internalType":"uint256","name":"id","type":"uint256"},
    {"internalType":"uint256","name":"amount","type":"uint256"},
    {"internalType":"bytes","name":"data","type":"bytes"}
  ],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[
    {"internalType":"address","name":"account","type":"address"},
    {"internalType":"uint256","name":"id","type":"uint256"}
  ],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
  "stateMutability":"view","type":"function"}
];

let provider, signer, contract;

// Conectar Wallet
document.getElementById("connectButton").onclick = connectWallet;

async function connectWallet() {
  if (!window.ethereum) return alert("Instala MetaMask");
  
  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    
    // Verificar red
    const network = await provider.getNetwork();
    if (network.chainId !== CONFIG.chainId) {
      await switchNetwork();
      return;
    }
    
    contract = new ethers.Contract(CONFIG.contractAddress, ABI, signer);
    document.getElementById("tokenSection").style.display = "block";
    document.getElementById("walletStatus").textContent = "Conectado";
    document.getElementById("connectButton").style.display = "none";
    
    // Configurar listeners
    document.getElementById("mintButton").onclick = mintToken;
    document.getElementById("checkBalance").onclick = checkBalance;
    
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("walletStatus").textContent = "Error de conexión";
  }
}

async function switchNetwork() {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${CONFIG.chainId.toString(16)}` }]
    });
  } catch (error) {
    console.error("Error cambiando de red:", error);
    alert(`Por favor cambia a Sepolia Testnet (ChainID: ${CONFIG.chainId})`);
  }
}

async function mintToken() {
  try {
    const userAddress = await signer.getAddress();
    const tx = await contract.mint(userAddress, CONFIG.tokenId, 1, "0x");
    await tx.wait();
    alert("Token minteado exitosamente!");
    checkBalance();
  } catch (error) {
    console.error("Error minteando:", error);
    alert("Error al mintear: " + error.message);
  }
}

async function checkBalance() {
  try {
    const userAddress = await signer.getAddress();
    const balance = await contract.balanceOf(userAddress, CONFIG.tokenId);
    
    const tokenInfo = document.getElementById("tokenInfo");
    tokenInfo.innerHTML = `
      <div id="tokenCard">
        <h3>Token Almas #${CONFIG.tokenId}</h3>
        <p>Balance: ${balance}</p>
        <p>Contrato: ${CONFIG.contractAddress}</p>
        <a href="${CONFIG.tokenURI}" target="_blank">Ver Metadatos</a>
      </div>
    `;
    
  } catch (error) {
    console.error("Error consultando balance:", error);
  }
}