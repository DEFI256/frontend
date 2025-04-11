import React, { useState, useEffect } from 'react';
import { Layout, message, Dropdown, Space, Drawer } from 'antd';
import { ethers } from 'ethers';
import { Routes, Route, useNavigate } from 'react-router-dom';
import WalletConnect from './components/WalletConnect';
import SwapPage from './components/SwapPage';
import BuyPage from './components/BuyPage';
import Pools from './components/Pools';
import PoolDetails from './components/PoolDetails';
import Tokens from './components/Tokens';
import Liquidity from './components/Liquidity';
import Transactions from './components/Transactions';
import TransactionHistory from './components/TransactionHistory';
import SwapABI from './abis/Swap.json';
import {
  DeliveredProcedureOutlined,
  BankOutlined,
  PoweroffOutlined
} from '@ant-design/icons';

const { Header, Content } = Layout;

const SWAP_ADDRESS = '0x123456789012345678901234567890123456789A';

function App() {
  const navigate = useNavigate();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [swapContract, setSwapContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredNav, setHoveredNav] = useState(null);
  const [account, setAccount] = useState('');
  const [balanceUSD, setBalanceUSD] = useState(0);
  const [tokenBalances, setTokenBalances] = useState({});
  const [hoveredButton, setHoveredButton] = useState(null);

  // 代币配置
  const tokens = [
    { name: 'ETH', address: '0xETH...', icon: 'Ξ', decimals: 18 },
    { name: 'SHIT', address: '0xSHIT...', icon: '💩', decimals: 18 },
    { name: 'USDC', address: '0xUSDC...', icon: '$', decimals: 6 },
    { name: 'DAI', address: '0xDAI...', icon: '◈', decimals: 18 },
  ];

  // 格式化代币数量
  const formatTokenAmount = (amountInWei, tokenAddress) => {
    const token = tokens.find(t => t.address === tokenAddress);
    if (!token) return '0';
    return ethers.formatUnits(amountInWei, token.decimals);
  };

  // 获取余额
  const fetchBalances = async () => {
    if (!window.ethereum || !account) return;
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balances = {};
      
      // 获取ETH余额
      const ethBalance = await provider.getBalance(account);
      balances['0xETH...'] = ethBalance.toString();
      
      // 获取其他代币余额
      for (const token of tokens.filter(t => t.address !== '0xETH...')) {
        const tokenContract = new ethers.Contract(
          token.address, 
          ['function balanceOf(address) view returns (uint256)'],
          provider
        );
        const balance = await tokenContract.balanceOf(account);
        balances[token.address] = balance.toString();
      }
      
      setTokenBalances(balances);
      updateUSDValue(balances);
    } catch (error) {
      console.error('获取余额失败:', error);
    }
  };

  // 更新USD价值
  const updateUSDValue = (balances) => {
    // 这里应该是从API获取价格数据
    // 示例：简单计算ETH价值
    let totalUSD = 0;
    if (balances['0xETH...']) {
      const ethAmount = parseFloat(formatTokenAmount(balances['0xETH...'], '0xETH...'));
      totalUSD += ethAmount * 2000; // 假设ETH价格为$2000
    }
    setBalanceUSD(totalUSD);
  };

  // 钱包连接回调
  const onWalletConnected = (connected, account) => {
    if (connected) {
      setAccount(account);
      setIsDrawerVisible(true);
      fetchBalances();
    }
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  const customButtonStyle = {
    backgroundColor: 'rgba(256, 256, 224)',
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
    backgroundColor: 'rgba(256, 256, 179)',
  };

  const iconStyle = {
    fontSize: '24px',
    color: '#FFD700',
    marginBottom: '8px',
  };

  const textStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#FFD700',
  };

  // 定义导航菜单项
  const tradeItems = [
    { key: 'swap', label: <a onClick={() => navigate('/')}>Swap</a> },
    { key: 'limit', label: 'Limit' },
    { key: 'send', label: 'Send' },
    { key: 'buy', label: <a onClick={() => navigate('/buy')}>Buy</a> },
  ];

  const exploreItems = [
    { key: 'tokens', label: <a href="/tokens">Tokens</a> },
    { key: 'pools', label: <a href="/pools">Pools</a> },
    { key: 'transactions', label: <a href="/transactions">Transactions</a> },
  ];

  const poolItems = [
    { key: 'view', label: 'View' },
    { key: 'create', label: 'Create' },
  ];

  // 初始化合约
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
                  href="/"
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
            <Routes>
              <Route path="/" element={<SwapPage swapContract={swapContract} fetchBalances={fetchBalances} />} />
              <Route path="/buy" element={<BuyPage swapContract={swapContract} fetchBalances={fetchBalances} />} />
              <Route path="/history" element={<TransactionHistory />} />
              <Route path="/pools" element={<Pools />} />
              <Route path="/pools/:poolId" element={<PoolDetails />} /> 
              <Route path="/tokens" element={<Tokens />} />
              <Route path="/liquidity" element={<Liquidity />} />
              <Route path="/transactions" element={<Transactions />} />
            </Routes>
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
            />
          }>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
              <img
                src="/shit2.png"
                alt="Avatar"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  marginRight: '10px',
                }}
              />
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : '未连接'}
              </div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>
              ${balanceUSD.toFixed(2)}
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
            <div 
              style={{
                ...customButtonStyle,
                ...(hoveredButton === 'buy' ? customButtonHoverStyle : {}),
              }}
              onMouseEnter={() => setHoveredButton('buy')}
              onMouseLeave={() => setHoveredButton(null)}
              onClick={() => {
                closeDrawer();
                navigate('/buy');
              }}
            >
              <div style={iconStyle}>
                <BankOutlined />
              </div>
              <div style={textStyle}>Buy</div>
            </div>
            <div 
              style={{
                ...customButtonStyle,
                ...(hoveredButton === 'receive' ? customButtonHoverStyle : {}),
              }}
              onMouseEnter={() => setHoveredButton('receive')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <div style={iconStyle}>
                <DeliveredProcedureOutlined />
              </div>
              <div style={textStyle}>Receive</div>
            </div>
          </div>

          {/* 代币余额列表 */}
          <div style={{ margin: '20px 0' }}>
            <h4 style={{ marginBottom: '12px', color: '#666' }}>代币余额</h4>
            {tokens.map(token => (
              <div 
                key={token.address} 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: '1px solid #f0f0f0'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '8px' }}>{token.icon}</span>
                  <span>{token.name}</span>
                </div>
                <div>
                  {tokenBalances[token.address] ? 
                    formatTokenAmount(tokenBalances[token.address], token.address) : 
                    'Loading...'}
                </div>
              </div>
            ))}
          </div>
        </Drawer>
      </Layout>
  );
}

export default App;