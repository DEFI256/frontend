# DEX Frontend

## Overview

This is the frontend for a Decentralized Exchange (DEX), built for the COMP5568 - Decentralized Finance final project (Semester 2, Winter 2025). It connects to a blockchain smart contract, enabling wallet integration, token swapping, and transaction history display.

- **Features**: MetaMask wallet connection, token swap (2+ tokens), simple UI.
- **Tech**: React, Ant Design v5, Ethers.js v6, JavaScript.

---

## Prerequisites

- Node.js (14+)
- MetaMask browser extension
- Deployed DEX smart contract (e.g., Sepolia or Hardhat)

---

## Setup & Run

1. **Clone Repository**
   ```bash
   git clone <your-repo-url>
   cd dex-frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Contract**
   - Edit `src/App.js`: Replace `SWAP_ADDRESS` with your contract address.
   - Update `src/abis/Swap.json` with your contract ABI.

4. **Start Local Backend (Optional)**
   - For Hardhat: `npx hardhat node` in a separate terminal.

5. **Run Frontend**
   ```bash
   npm start
   ```
   - Opens at `http://localhost:3000`.

6. **Test**
   - Connect MetaMask (Hardhat: `http://127.0.0.1:8545`, or Sepolia).
   - Swap tokens and check history.

---

## Structure

```
/*
dex-frontend/
├── src/
│   ├── abis/Swap.json
│   ├── components/
│   │   ├── WalletConnect.js
│   │   ├── Swap.js
│   │   └── TransactionHistory.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
*/

new：

dex-frontend/
├── src/
│   ├── abis/Swap.json
│   ├── components/
│   │   ├── WalletConnect.js
│   │   ├── Swap.js
│   │   ├── TransactionHistory.js
│   │   ├── HistoryPrice.js
│   │   ├── Volume.js
│   │   ├── CandlestickChart.js
│   │   ├── HistoryPricePage.js
│   │   ├── VolumePage.js
│   │   └── CandlestickPage.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

---

## Troubleshooting

- **MetaMask not detected**: Install extension, refresh page.
- **Swap fails**: Check contract address, network, and token balances.
- **UI issues**: Ensure `antd@5` is installed (`npm install antd`).

---

## Notes

- Ant Design v5 uses CSS-in-JS; no need for `antd/dist/antd.css`.
- Expand to 10 tokens by editing `tokens` in `Swap.js`.
