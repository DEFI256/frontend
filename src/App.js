import React, { useEffect, useState } from 'react';
import { Layout, message, Dropdown, Space, Drawer } from 'antd';
import { ethers } from 'ethers';
import WalletConnect from './components/WalletConnect';
// import Swap from './components/Swap';
import TransactionHistory from './components/TransactionHistory';
import SwapABI from './abis/Swap.json';
import {
  DeliveredProcedureOutlined,
  BankOutlined,
  PoweroffOutlined
} from '@ant-design/icons';
const { Header, Content } = Layout;

// 替换为你部署的实际合约地址
const SWAP_ADDRESS = '0x123456789012345678901234567890123456789A';
function App() {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [swapContract, setSwapContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredNav, setHoveredNav] = useState(null);
  const onWalletConnected = (connected) => {
    if (connected) {
      setIsDrawerVisible(true); // 显示 Drawer
    }
  };
  // const showDrawer = () => {
  //   setIsDrawerVisible(true);
  // };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  const customButtonStyle = {
    backgroundColor: 'rgba(256, 256, 224)', // 淡黄色
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    width: '100px',
    height: '50px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  };

  const customButtonHoverStyle = {
    backgroundColor: 'rgba(256, 256, 179)', // 鼠标悬停时变暗的颜色
  };

  const iconStyle = {
    fontSize: '24px',
    color: '#FFD700', // 黄色
    marginBottom: '8px',
  };

  const textStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#FFD700', // 黄色
  };
  const [hoveredButton, setHoveredButton] = useState(null);
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
        <WalletConnect onWalletConnected={onWalletConnected} />
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
      {/* Drawer 组件 */}
      <Drawer
        title="Wallet"
        placement="right"
        onClose={closeDrawer}
        open={isDrawerVisible}
        width={350}
        extra={
          <PoweroffOutlined
            style={{ fontSize: '24px', color: 'rgba(202, 213, 46, 1)', cursor: 'pointer' }}
            onClick={closeDrawer}
          />}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
            <img
              src="/shit2.png" // 替换为头像图片的路径
              alt="Avatar"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                marginRight: '10px',
              }}
            />
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>0xF807...2a7B</div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>$0.00</div>
          <div style={{ color: 'Khaki', fontSize: '16px' }}>▲ 0.00%</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
          <div style={{
            ...customButtonStyle,
            ...(hoveredButton === 'buy' ? customButtonHoverStyle : {}),
          }}
            onMouseEnter={() => setHoveredButton('buy')}
            onMouseLeave={() => setHoveredButton(null)}>
            <div style={iconStyle}>
              <BankOutlined />
            </div>
            <div style={textStyle}>Buy</div>
          </div>
          <div style={{
            ...customButtonStyle,
            ...(hoveredButton === 'receive' ? customButtonHoverStyle : {}),
          }}
            onMouseEnter={() => setHoveredButton('receive')}
            onMouseLeave={() => setHoveredButton(null)}>
            <div style={iconStyle}>
              <DeliveredProcedureOutlined />
            </div>
            <div style={textStyle}>Receive</div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '20px', padding: '0 20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Welcome to your wallet!</h3>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Looks like you have a new wallet. Let’s get it funded before you make your first swap.
          </p>
        </div>
      </Drawer>
    </Layout>
  );
}

export default App;