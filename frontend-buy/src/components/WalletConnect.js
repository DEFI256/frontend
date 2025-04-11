import React from 'react';
import { Button, message } from 'antd';
import { ethers } from 'ethers';

function WalletConnect({ onWalletConnected }) {
  const connectWallet = async () => {
    if (!window.ethereum) {
      message.error('请安装 MetaMask 钱包!');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);

      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        // 通知父组件钱包已连接，并传递账户地址
        if (onWalletConnected) {
          onWalletConnected(true, address);
        }
      }
    } catch (error) {
      console.error('钱包连接失败:', error);
      message.error('用户拒绝连接或发生错误');
    }
  };

  return (
    <Button 
      type="primary" 
      style={{ backgroundColor: '#FFD700', borderColor: '#FFD700', fontWeight: 'bold' }}
      onClick={connectWallet}
    >
      Connect Wallet
    </Button>
  );
}

export default WalletConnect;