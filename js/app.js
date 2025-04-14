// Configuración para Vercel
const CONFIG = {
  contractAddress: "0x20ae870f101b578917fec53d4e98ef0abe0df6fc",
  tokenId: 1,
  tokenURI: "/1.json",
  chainId: 11155111, // Sepolia
  tokenImage: "imagenes/lorddev.jpg"
};

// ABI del contrato
const ABI = [
  {
    "inputs": [
      {"internalType":"address","name":"account","type":"address"},
      {"internalType":"uint256","name":"id","type":"uint256"},
      {"internalType":"uint256","name":"amount","type":"uint256"},
      {"internalType":"bytes","name":"data","type":"bytes"}
    ],
    "name":"mint",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  },
  {
    "inputs":[
      {"internalType":"address","name":"account","type":"address"},
      {"internalType":"uint256","name":"id","type":"uint256"}
    ],
    "name":"balanceOf",
    "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
    "stateMutability":"view",
    "type":"function"
  }
];

let provider, signer, contract;

// Inicialización
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById("connectButton").onclick = connectWallet;
  
  // Verificar si ya está conectado
  if(window.ethereum && window.ethereum.selectedAddress) {
    connectWallet();
  }
});

async function connectWallet() {
  if (!window.ethereum) {
    return alert("Por favor instala MetaMask!");
  }

  try {
    // Solicitar conexión
    const accounts = await window.ethereum.request({ 
      method: "eth_requestAccounts" 
    });
    
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    
    // Verificar red
    const network = await provider.getNetwork();
    if(network.chainId !== CONFIG.chainId) {
      await switchNetwork();
      return;
    }
    
    // Inicializar contrato
    contract = new ethers.Contract(CONFIG.contractAddress, ABI, signer);
    
    // Actualizar UI
    document.getElementById("walletStatus").textContent = 
      `Conectado: ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`;
    document.getElementById("tokenSection").style.display = "block";
    document.getElementById("connectButton").textContent = "✅ Wallet Conectada";
    
    // Configurar eventos
    document.getElementById("mintButton").onclick = mintToken;
    document.getElementById("checkBalance").onclick = checkBalance;
    
    // Verificar balance inicial
    await checkBalance();
    
  } catch(error) {
    console.error("Error:", error);
    document.getElementById("walletStatus").textContent = 
      `Error: ${error.message}`;
  }
}

async function switchNetwork() {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${CONFIG.chainId.toString(16)}` }]
    });
  } catch(error) {
    console.error("Error cambiando de red:", error);
    alert(`Por favor cambia a Sepolia Testnet (ChainID: ${CONFIG.chainId})`);
  }
}

async function mintToken() {
  const button = document.getElementById("mintButton");
  try {
    button.disabled = true;
    button.textContent = "⏳ Minteando...";
    
    const tx = await contract.mint(
      await signer.getAddress(),
      CONFIG.tokenId,
      1, // Cantidad
      "0x" // Datos adicionales (vacío)
    );
    
    document.getElementById("walletStatus").textContent = 
      "⏳ Esperando confirmación...";
    
    await tx.wait();
    await checkBalance();
    
    button.textContent = "✅ Minteado!";
    setTimeout(() => {
      button.textContent = "🆕 Mintear Token Alma";
      button.disabled = false;
    }, 3000);
    
  } catch(error) {
    console.error("Error minteando:", error);
    document.getElementById("walletStatus").textContent = 
      `Error: ${error.message}`;
    button.textContent = "🆕 Mintear Token Alma";
    button.disabled = false;
  }
}

async function checkBalance() {
  try {
    const balance = await contract.balanceOf(
      await signer.getAddress(),
      CONFIG.tokenId
    );
    
    const tokenInfo = document.getElementById("tokenInfo");
    tokenInfo.innerHTML = `
      <div class="alert alert-success">
        <h4>Token Almas #${CONFIG.tokenId}</h4>
        <p>Tienes: <strong>${balance}</strong> tokens</p>
        <a href="${CONFIG.tokenURI}" target="_blank" class="btn btn-sm btn-outline-primary">
          Ver Metadatos
        </a>
        <a href="https://sepolia.etherscan.io/address/${CONFIG.contractAddress}" 
           target="_blank" class="btn btn-sm btn-outline-secondary ms-2">
          Ver en Etherscan
        </a>
      </div>
    `;
    
  } catch(error) {
    console.error("Error consultando balance:", error);
    document.getElementById("tokenInfo").innerHTML = `
      <div class="alert alert-danger">
        Error al cargar balance: ${error.message}
      </div>
    `;
  }
}