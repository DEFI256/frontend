import React, { useEffect, useState } from 'react';
import { Layout, message } from 'antd';
import { ethers } from 'ethers';
import WalletConnect from './components/WalletConnect';
import Swap from './components/Swap';
import TransactionHistory from './components/TransactionHistory';
import SwapABI from './abis/Swap.json';

const { Header, Content } = Layout;

// 替换为你部署的实际合约地址
const SWAP_ADDRESS = '0x123456789012345678901234567890123456789A'; 

function App() {
  const [swapContract, setSwapContract] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initContract = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(SWAP_ADDRESS, SwapABI, signer);
          setSwapContract(contract);
        } else {
          message.error('请安装 MetaMask 钱包!');
        }
      } catch (error) {
        console.error('合约初始化失败:', error);
        message.error('合约连接失败: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    
    initContract();
  }, []);

  return (
    <Layout>
      <Header style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 20px' }}>
        <WalletConnect />
      </Header>
      <Content style={{ padding: '20px', minHeight: 'calc(100vh - 64px)' }}>
        {loading ? (
          <p>正在加载合约...</p>
        ) : swapContract ? (
          <>
            <Swap swapContract={swapContract} />
            <TransactionHistory />
          </>
        ) : (
          <p>无法连接到合约，请确保已安装 MetaMask 并连接到正确的网络。</p>
        )}
      </Content>
    </Layout>
  );
}

export default App;