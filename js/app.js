// Configuración del contrato
const CONTRACT_ADDRESS = "0x20ae870f101b578917fec53d4e98ef0abe0df6fc";
const TOKEN_URI = "https://l0rdb0t.github.io/TokenAlmas/1.json";

// ABI del contrato (simplificado para las funciones que usaremos)
const ABI = [
    {
        "inputs": [
            {"internalType": "address", "name": "account", "type": "address"},
            {"internalType": "uint256", "name": "id", "type": "uint256"},
            {"internalType": "uint256", "name": "amount", "type": "uint256"},
            {"internalType": "bytes", "name": "data", "type": "bytes"}
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "account", "type": "address"},
            {"internalType": "uint256", "name": "id", "type": "uint256"}
        ],
        "name": "balanceOf",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "setURI",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

let provider, signer, contract;

// Conectar Wallet
document.getElementById("connectButton").onclick = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      const network = await provider.getNetwork();

      if (network.chainId !== 11155111) { // Sepolia Testnet
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }] // ChainId de Sepolia
          });
        } catch (switchError) {
          console.error("Error cambiando a Sepolia:", switchError);
        }
        return;
      }

      contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      document.getElementById("tokenInterface").style.display = "block";
      document.getElementById("status").innerText = "✅ Wallet conectada. Ahora puedes mintear tokens.";
      
    } catch (err) {
      console.error(err);
      document.getElementById("status").innerText = "❌ Error al conectar wallet.";
    }
  } else {
    alert("Necesitas instalar Metamask");
  }
};

// Mintear nuevo token
document.getElementById("mintButton").onclick = async () => {
  try {
    const userAddress = await signer.getAddress();
    document.getElementById("status").innerText = "⏳ Minteando tu token...";
    
    // Usamos ID 1 para el token (puedes cambiarlo)
    const tx = await contract.mint(userAddress, 1, 1, "0x");
    await tx.wait();
    
    document.getElementById("status").innerText = "✅ Token minteado con éxito!";
    loadUserTokens();
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "❌ Error al mintear token: " + err.message;
  }
};

// Ver tokens del usuario
document.getElementById("viewTokens").onclick = async () => {
  loadUserTokens();
};

// Cargar tokens del usuario
async function loadUserTokens() {
  try {
    const userAddress = await signer.getAddress();
    const tokenId = 1; // ID de nuestro token
    const balance = await contract.balanceOf(userAddress, tokenId);
    
    const tokensContainer = document.getElementById("tokensContainer");
    tokensContainer.innerHTML = "";
    
    if (balance > 0) {
      tokensContainer.innerHTML = `
        <div class="token-card">
          <h3>Token Almas SFT</h3>
          <p>Tienes: ${balance} tokens</p>
          <p>ID: ${tokenId}</p>
          <a href="${TOKEN_URI}" target="_blank">Ver metadatos</a>
        </div>
      `;
    } else {
      tokensContainer.innerHTML = "<p>No tienes tokens todavía.</p>";
    }
    
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "❌ Error al cargar tokens.";
  }
}