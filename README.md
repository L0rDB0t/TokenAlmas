# LordDev SFT DApp

Esta es una DApp en la red **Sepolia Testnet** que permite a los usuarios reclamar un token SFT (ERC-1155) llamado **AlmasToken**.

---
## Contrato
address: 0x20ae870f101b578917fec53d4e98ef0abe0df6fc

## 🚀 Funcionalidades

- Conexión con MetaMask
- Reclamo único de un token SFT exclusivo
- Interfaz simple y directa
- Desplegado con GitHub Pages

---

## 🧱 Estructura

lorddev-sft-dapp/ ├── index.html → Página principal ├── js/ │ └── app.js → Lógica de conexión y reclamo ├── style.css → Estilos básicos ├── metadata/ │ └── 1.json → Metadata del token LordDev ├── images/ │ └── lorddev.png → Imagen del token └── README.md → Este archivo

yaml
Copy
Edit

---

## ⚙️ Cómo usar

1. Conectá tu wallet (MetaMask) a la red **Sepolia Testnet**
2. Visitá la página desplegada
3. Hacé clic en **"Conectar Wallet"**
4. Luego hacé clic en **"Reclamar Token"**

> 🔒 Solo se puede reclamar **una vez por dirección**.

---

## ✨ Información del Token

| Campo       | Valor                                                          |
|-------------|----------------------------------------------------------------|
| Nombre      | AlmasToken                                                        |
| Token ID    | `1`                                                            |
| Tipo        | SFT (ERC-1155)                                                 |
| Metadata    | [`metadata/1.json`](./metadata/1.json)                         |
| Imagen      | `images/lorddev.png`                                           |
| Red         | Sepolia Testnet                                                |
| Contrato    | `Aún no desplegado` (se actualizará luego del despliegue)     |

---

## 📦 Deployment

El proyecto está desplegado en Vercel Pages:

https://token-almas-3wchpgfkn-l0rdb0ts-projects.vercel.app/
yaml
Copy
Edit

---

## ⛓ Integración con el Smart Contract

La dirección del contrato y el ABI serán integrados en el archivo `app.js` una vez el contrato esté desplegado. El método `claim()` permite a los usuarios reclamar su token SFT.

---

## 🛠 Tecnologías

- HTML, CSS, JavaScript
- Ethers.js
- MetaMask
- GitHub Pages
- Sepolia Testnet

---

## 📜 Licencia

MIT License
