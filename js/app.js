// Configuración del contrato
const CONTRACT_ADDRESS = "0x20ae870f101b578917fec53d4e98ef0abe0df6fc";
const TOKEN_URI = "https://token-almas-1gae570ha-l0rdb0ts-projects.vercel.app/1.json";

// ABI simplificado para las funciones que necesitamos
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

// Variables globales
let provider, signer, contract;

// Al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  // Verificar si MetaMask está instalado
  if (!window.ethereum) {
    document.getElementById('status').innerText = "⚠️ Por favor instala MetaMask";
    document.getElementById('connectButton').disabled = true;
    return;
  }

  // Configurar eventos de los botones
  document.getElementById('connectButton').onclick = connectWallet;
  document.getElementById('claimButton').onclick = mintToken;
});

// Función para conectar wallet
async function connectWallet() {
  try {
    document.getElementById('status').innerText = "⏳ Conectando...";
    
    // Solicitar conexión de cuentas
    await window.ethereum.request({ method: "eth_requestAccounts" });
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    
    // Verificar que estamos en Sepolia (chainId 11155111)
    const network = await provider.getNetwork();
    if (network.chainId !== 11155111) {
      await switchToSepolia();
      return;
    }
    
    // Inicializar contrato
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    
    // Actualizar UI
    document.getElementById('status').innerHTML = `
      <span class="text-success">✅ Wallet conectada</span>
      <small class="d-block">${(await signer.getAddress()).substring(0, 6)}...${(await signer.getAddress()).substring(38)}</small>
    `;
    document.getElementById('claimButton').disabled = false;
    document.getElementById('connectButton').textContent = "✅ Conectado";
    document.getElementById('connectButton').classList.add('btn-success');
    
    // Mostrar información de tokens
    await showTokenInfo();
    
  } catch (error) {
    console.error("Error conectando wallet:", error);
    document.getElementById('status').innerHTML = `
      <span class="text-danger">❌ Error de conexión</span>
      <small class="d-block">${error.message}</small>
    `;
  }
}

// Función para cambiar a Sepolia
async function switchToSepolia() {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xaa36a7" }] // ChainId de Sepolia
    });
  } catch (error) {
    // Si la red no está añadida, la añadimos
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: "0xaa36a7",
            chainName: "Sepolia Test Network",
            nativeCurrency: {
              name: "Sepolia ETH",
              symbol: "ETH",
              decimals: 18
            },
            rpcUrls: ["https://rpc.sepolia.org"],
            blockExplorerUrls: ["https://sepolia.etherscan.io"]
          }]
        });
      } catch (addError) {
        console.error("Error añadiendo Sepolia:", addError);
      }
    }
    console.error("Error cambiando a Sepolia:", error);
  }
}

// Función para mintear tokens (usando el botón "Reclamar Token")
async function mintToken() {
  try {
    const claimButton = document.getElementById('claimButton');
    claimButton.disabled = true;
    document.getElementById('status').innerText = "⏳ Minteando tu token...";
    
    // Mintear 1 token con ID 1
    const tx = await contract.mint(await signer.getAddress(), 1, 1, "0x");
    await tx.wait();
    
    document.getElementById('status').innerHTML = `
      <span class="text-success">✅ Token minteado con éxito!</span>
      <small class="d-block">Transacción: ${tx.hash.substring(0, 10)}...</small>
    `;
    
    // Actualizar información de tokens
    await showTokenInfo();
    
  } catch (error) {
    console.error("Error minteando token:", error);
    document.getElementById('status').innerHTML = `
      <span class="text-danger">❌ Error al mintear</span>
      <small class="d-block">${error.message}</small>
    `;
  } finally {
    document.getElementById('claimButton').disabled = false;
  }
}

// Función para mostrar información de los tokens
async function showTokenInfo() {
  try {
    const tokensInfo = document.getElementById('tokensInfo');
    tokensInfo.style.display = "block";
    
    const balance = await contract.balanceOf(await signer.getAddress(), 1);
    
    tokensInfo.innerHTML = `
      <h3>Tu Token Almas</h3>
      <p>Tienes: <strong>${balance}</strong> tokens</p>
      <a href="${TOKEN_URI}" target="_blank" class="btn btn-sm btn-outline-primary">
        Ver metadatos del token
      </a>
      <a href="https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}" 
         target="_blank" class="btn btn-sm btn-outline-secondary ms-2">
        Ver contrato en Etherscan
      </a>
    `;
  } catch (error) {
    console.error("Error mostrando info de tokens:", error);
  }
}