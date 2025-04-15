Token Almas SFT - Documentación Completa
Token Almas SFT

📌 Descripción
Token Almas es un proyecto de token semi-fungible (SFT) implementado como un contrato inteligente en la red de prueba Sepolia de Ethereum. Este repositorio incluye:

Contrato inteligente MultiSig para tokens ERC1155

Interfaz web para conectar wallets y reclamar tokens

Metadatos estándar para visualización en marketplaces

🔧 Tecnologías Utilizadas
Blockchain: Ethereum Sepolia Testnet

Contrato Inteligente: Solidity (ERC1155)

Frontend: HTML, CSS, JavaScript

Librerías: Ethers.js, Bootstrap

Hosting: Vercel (alternativas: GitHub Pages, Netlify)

🚀 Instalación y Despliegue
Opción 1: Desplegar en Vercel (Recomendado)
Haz fork de este repositorio

Crea una cuenta en Vercel

Conecta tu cuenta de GitHub

Selecciona este repositorio para desplegar

Configura las opciones:

Framework: Static

Build Command: (dejar vacío)

Output Directory: .

Haz clic en Deploy

Opción 2: Ejecución Local
bash
Copy
# Clona el repositorio
git clone https://github.com/tu-usuario/token-almas.git

# Entra al directorio
cd token-almas

# Sirve la aplicación localmente (necesitas Python)
python3 -m http.server 8000
Abre tu navegador en: [http://localhost:8000](https://token-almas.vercel.app/)

📝 Guía de Uso
Para Usuarios
Conectar Wallet:

Haz clic en "🔌 Conectar Wallet"

Acepta la conexión en MetaMask

Asegúrate de estar en Sepolia Testnet

Reclamar Token:

Haz clic en "🎁 Reclamar Token"

Confirma la transacción en MetaMask

Espera la confirmación (puede tomar unos segundos)

Verificar Token:

Puedes ver tu token en:

Sepolia Etherscan

OpenSea Testnet (si está configurado)

Para Desarrolladores
Estructura de Archivos:

Copy
token-almas/
├── index.html          # Interfaz principal
├── imagenes/           # Assets visuales
│   └── lorddev.jpg     # Imagen del token
├── 1.json              # Metadatos del token
└── README.md           # Este archivo
Variables de Configuración:

CONTRACT_ADDRESS: Dirección del contrato desplegado

TOKEN_ID: ID del token SFT

ABI: Interfaz del contrato para interactuar

🔗 Enlaces Importantes
Contrato en Sepolia Etherscan: Ver contrato

Sitio Desplegado: Token Almas en Vercel

Documentación ERC1155: OpenZeppelin

🤝 Contribución
Si deseas contribuir al proyecto:

Haz fork del repositorio

Crea una rama con tu feature (git checkout -b feature/mejora)

Haz commit de tus cambios (git commit -am 'Añade alguna mejora')

Haz push a la rama (git push origin feature/mejora)

Abre un Pull Request

⚠️ Troubleshooting
Problema: El botón "Conectar Wallet" no hace nada

Solución: Verifica que MetaMask esté instalado y no bloqueado por extensiones

Problema: Transacción falla con "out of gas"

Solución: Consigue ETH de prueba de un faucet de Sepolia

Problema: Error 404 al cargar recursos

Solución: Verifica las rutas de los archivos en tu despliegue

📜 Licencia
Este proyecto está bajo licencia MIT. Ver archivo LICENSE para más detalles.

Nota: Este proyecto está configurado para la red de prueba Sepolia. No utilices fondos reales.
