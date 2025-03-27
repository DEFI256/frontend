import React, { useState } from 'react';
import { Button } from 'antd';
import { ethers } from 'ethers';

function WalletConnect({ onWalletConnected }) {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        if (onWalletConnected) {
          onWalletConnected(true); // 通知父组件钱包已连接
        }
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  return (
    <Button color="yellow" variant="solid" onClick={connectWallet}>
      {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
    </Button>
  );
}

export default WalletConnect;