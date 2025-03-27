import React, { useEffect, useState } from 'react';
import { Layout, message, Dropdown, Space } from 'antd';
import { ethers } from 'ethers';
import WalletConnect from './components/WalletConnect';
// import Swap from './components/Swap';
import TransactionHistory from './components/TransactionHistory';
import SwapABI from './abis/Swap.json';

const { Header, Content } = Layout;

// 替换为你部署的实际合约地址
const SWAP_ADDRESS = '0x123456789012345678901234567890123456789A';
function App() {
  const [swapContract, setSwapContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredNav, setHoveredNav] = useState(null);

  // 定义导航菜单项
  const tradeItems = [
    { key: 'swap', label: 'Swap' },
    { key: 'limit', label: 'Limit' },
    { key: 'send', label: 'Send' },
    { key: 'buy', label: 'Buy' },
  ];

  const exploreItems = [
    { key: 'tokens', label: 'Tokens' },
    { key: 'pools', label: 'Pools' },
    { key: 'transactions', label: 'Transactions' },
  ];

  const poolItems = [
    { key: 'view', label: 'View' },
    { key: 'create', label: 'Create' },
  ];

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
      <Header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="/shit.png"
              alt="ShitSwap Logo"
              style={{ height: '32px', marginRight: '8px' }}
            />
            <span style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', marginRight: '20px' }}>
              ShitSwap
            </span>
          </div>
          <div className="nav-buttons">
            <Dropdown
            overlayStyle={{ width: '100px', minWidth: '100px', textAlign: 'center' }}
              menu={{ items: tradeItems }}
              placement="bottom"
              onOpenChange={(open) => {
                if (open) setHoveredNav('trade');
                else if (hoveredNav === 'trade') setHoveredNav(null);
              }}
            >
              <a
                href="/#"
                style={{
                  color: hoveredNav === 'trade' ? '#fff' : 'rgba(125, 125, 125, 1)',
                  fontSize: '16px',
                  padding: '0 15px',
                  cursor: 'pointer',
                  marginRight: '10px',
                  textDecoration: 'none',
                }}
                onMouseEnter={() => setHoveredNav('trade')}
                onMouseLeave={() => !document.querySelector('.ant-dropdown:hover') && setHoveredNav(null)}
              >
                <Space>
                  Trade
                </Space>
              </a>
            </Dropdown>

            <Dropdown
            overlayStyle={{ width: '100px', minWidth: '100px', textAlign: 'center' }}
              menu={{ items: exploreItems }}
              placement="bottom"
              onOpenChange={(open) => {
                if (open) setHoveredNav('explore');
                else if (hoveredNav === 'explore') setHoveredNav(null);
              }}
            >
              <a
                href="/#"
                style={{
                  color: hoveredNav === 'explore' ? '#fff' : 'rgba(125, 125, 125, 1)',
                  fontSize: '16px',
                  padding: '0 15px',
                  cursor: 'pointer',
                  marginRight: '10px',
                  textDecoration: 'none',
                }}
                onMouseEnter={() => setHoveredNav('explore')}
                onMouseLeave={() => !document.querySelector('.ant-dropdown:hover') && setHoveredNav(null)}
              >
                <Space>
                  Explore
                </Space>
              </a>
            </Dropdown>

            <Dropdown
            overlayStyle={{ width: '100px', minWidth: '100px', textAlign: 'center' }}
              menu={{ items: poolItems }}
              placement="bottom"
              onOpenChange={(open) => {
                if (open) setHoveredNav('pool');
                else if (hoveredNav === 'pool') setHoveredNav(null);
              }}
            >
              <a
                href="/#"
                style={{
                  color: hoveredNav === 'pool' ? '#fff' : 'rgba(125, 125, 125, 1)',
                  fontSize: '16px',
                  padding: '0 15px',
                  cursor: 'pointer',
                  marginRight: '10px',
                  textDecoration: 'none',
                }}
                onMouseEnter={() => setHoveredNav('pool')}
                onMouseLeave={() => !document.querySelector('.ant-dropdown:hover') && setHoveredNav(null)}
              >
                <Space>
                  Pool
                </Space>
              </a>
            </Dropdown>
          </div>
        </div>
        <WalletConnect />
      </Header>
      <Content style={{ padding: '20px', minHeight: 'calc(100vh - 64px)' }}>
        {loading ? (
          <p>正在加载合约...</p>
        ) : swapContract ? (
          <>
            {/* <Swap swapContract={swapContract} /> */}
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