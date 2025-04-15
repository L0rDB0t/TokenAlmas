// Debug inicial
console.log("Iniciando aplicación...");

// Configuración
const CONTRACT_ADDRESS = "0x20ae870f101b578917fec53d4e98ef0abe0df6fc";
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
  }
];

// Elementos UI
const connectButton = document.getElementById("connectButton");
const statusElement = document.getElementById("status");

// 1. Verificar MetaMask al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM completamente cargado");
  
  if (typeof window.ethereum === 'undefined') {
    statusElement.innerHTML = `
      <span class="text-danger">❌ MetaMask no detectado</span>
      <p class="small">Instala <a href="https://metamask.io/" target="_blank">MetaMask</a> para continuar</p>
    `;
    connectButton.disabled = true;
    return;
  }
  
  console.log("MetaMask detectado:", window.ethereum);
  setupEventListeners();
});

// 2. Configurar listeners de eventos
function setupEventListeners() {
  console.log("Configurando event listeners...");
  
  connectButton.addEventListener('click', async () => {
    console.log("Botón Conectar clickeado");
    await handleWalletConnection();
  });
}

// 3. Manejar conexión de wallet
async function handleWalletConnection() {
  try {
    console.log("Iniciando conexión...");
    statusElement.textContent = "Conectando...";
    connectButton.disabled = true;
    
    // Solicitar conexión de cuentas
    const accounts = await window.ethereum.request({ 
      method: "eth_requestAccounts" 
    });
    
    console.log("Cuentas recibidas:", accounts);
    
    // Verificar red (Sepolia Testnet)
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    console.log("ChainID actual:", chainId);
    
    if (chainId !== "0xaa36a7") {
      await switchToSepolia();
      return;
    }
    
    // Configurar ethers.js
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    
    console.log("Conexión exitosa. Dirección:", address);
    
    // Actualizar UI
    statusElement.innerHTML = `
      <span class="text-success">✅ Conectado correctamente</span>
      <p class="small">${address.substring(0, 6)}...${address.substring(38)}</p>
    `;
    connectButton.textContent = "✅ Conectado";
    
    // Habilitar funcionalidad adicional
    document.getElementById("claimButton").disabled = false;
    
  } catch (error) {
    console.error("Error en conexión:", error);
    statusElement.innerHTML = `
      <span class="text-danger">❌ Error de conexión</span>
      <p class="small">${error.message}</p>
    `;
    connectButton.disabled = false;
  }
}

// 4. Cambiar a Sepolia Testnet
async function switchToSepolia() {
  try {
    console.log("Intentando cambiar a Sepolia...");
    statusElement.textContent = "Cambiando a Sepolia Testnet...";
    
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xaa36a7" }] // Sepolia
    });
    
    console.log("Cambio a Sepolia exitoso");
    await handleWalletConnection();
    
  } catch (error) {
    console.error("Error cambiando de red:", error);
    
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
        await switchToSepolia();
      } catch (addError) {
        console.error("Error añadiendo red Sepolia:", addError);
        statusElement.innerHTML = `
          <span class="text-danger">❌ Error de red</span>
          <p class="small">Por favor cambia manualmente a Sepolia Testnet</p>
        `;
      }
    }
  }
}
// Verifica si MetaMask está inyectado
console.log("MetaMask disponible:", !!window.ethereum);

// Verifica si ethers.js está cargado
console.log("ethers disponible:", !!ethers);

// Prueba la conexión directa
window.ethereum.request({ method: 'eth_requestAccounts' })
  .then(accounts => console.log("Cuentas:", accounts))
  .catch(error => console.error("Error:", error));