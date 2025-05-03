// import React, { useState, useEffect } from 'react';
// import { ConfigProvider, Layout, Dropdown, Space, Drawer } from 'antd';
// import { useNavigate, Routes, Route, BrowserRouter as Router } from 'react-router-dom';
// import { WalletProvider, useWallet } from './contexts/WalletContext';
// import WalletConnect from './components/WalletConnect';
// import SwapPage from './components/SwapPage';
// import Pools from './components/Pools';
// import BuyPage from './components/BuyPage';
// import PoolDetails from './components/PoolDetails';
// import Tokens from './components/Tokens';
// import Liquidity from './components/Liquidity';
// import RemoveLiquidity from './components/RemoveLiquidity';
// import Transactions from './components/Transactions';
// import TransactionHistory from './components/TransactionHistory';
// import {
//   DeliveredProcedureOutlined,
//   BankOutlined,
//   PoweroffOutlined
// } from '@ant-design/icons';
// const { Header, Content } = Layout;

// // 内部组件使用钱包上下文
// function AppContent() {
//   const navigate = useNavigate();
//   const { walletAddress, formatAddress, loading, isConnected, disconnectWallet, tokenBalances, fetchTokenBalances } = useWallet();
//   const [isDrawerVisible, setIsDrawerVisible] = useState(false);
//   const [hoveredNav, setHoveredNav] = useState(null);
//   const [hoveredButton, setHoveredButton] = useState(null);

//   const handleDisconnect = () => {
//     disconnectWallet(); // 调用 useWallet 中的 disconnectWallet 函数
//     closeDrawer(); // 关闭抽屉
//     // 可以添加提示消息
//   };
//   const onWalletConnected = (connected) => {
//     if (connected) {
//       setIsDrawerVisible(true); // 显示 Drawer
//     }
//   };

//   const closeDrawer = () => {
//     setIsDrawerVisible(false);
//   };

//   const customButtonStyle = {
//     backgroundColor: 'rgba(256, 256, 224)', // 淡黄色
//     borderRadius: '12px',
//     padding: '20px',
//     textAlign: 'center',
//     width: '100px',
//     height: '50px',
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     cursor: 'pointer',
//   };

//   const customButtonHoverStyle = {
//     backgroundColor: 'rgba(256, 256, 179)', // 鼠标悬停时变暗的颜色
//   };

//   const iconStyle = {
//     fontSize: '24px',
//     color: '#FFD700', // 黄色
//     marginBottom: '8px',
//   };

//   const textStyle = {
//     fontSize: '16px',
//     fontWeight: 'bold',
//     color: '#FFD700', // 黄色
//   };

//   // 定义导航菜单项
//   const tradeItems = [
//     { key: 'swap', label: 'Swap' },
//     { key: 'limit', label: 'Limit' },
//     { key: 'send', label: 'Send' },
//     { key: 'buy', label: <a href="/#" onClick={() => navigate('/buy')}>Buy</a> },
//   ];

//   const exploreItems = [
//     { key: 'tokens', label: <a href="/tokens">Tokens</a> },
//     { key: 'pools', label: <a href="/pools">Pools</a> },
//     { key: 'transactions', label: <a href="/transactions">Transactions</a> },
//   ];

//   const poolItems = [
//     { key: 'view', label: 'View' },
//     { key: 'create', label: 'Create' },
//   ];

//   useEffect(() => {
//     // 每次打开 Drawer 时刷新代币余额
//     if (isDrawerVisible) {
//       fetchTokenBalances();
//     }
//   }, [isDrawerVisible, fetchTokenBalances]);

//   return (
//     <Layout>
//       <Header style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         padding: '0 20px'
//       }}>
//         <div style={{ display: 'flex', alignItems: 'center' }}>
//           <a href="/" style={{ textDecoration: 'none' }}>
//             <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
//               <img
//                 src="/shit.png"
//                 alt="ShitSwap Logo"
//                 style={{ height: '32px', marginRight: '8px' }}
//               />
//               <span style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', marginRight: '20px' }}>
//                 ShitSwap
//               </span>
//             </div>
//           </a>

//           <div className="nav-buttons">
//             <Dropdown
//               overlayStyle={{ width: '100px', minWidth: '100px', textAlign: 'center' }}
//               menu={{ items: tradeItems }}
//               placement="bottom"
//               onOpenChange={(open) => {
//                 if (open) setHoveredNav('trade');
//                 else if (hoveredNav === 'trade') setHoveredNav(null);
//               }}
//             >
//               <a
//                 href="/#"
//                 style={{
//                   color: hoveredNav === 'trade' ? '#fff' : 'rgba(125, 125, 125, 1)',
//                   fontSize: '16px',
//                   padding: '0 15px',
//                   cursor: 'pointer',
//                   marginRight: '10px',
//                   textDecoration: 'none',
//                 }}
//                 onMouseEnter={() => setHoveredNav('trade')}
//                 onMouseLeave={() => !document.querySelector('.ant-dropdown:hover') && setHoveredNav(null)}
//               >
//                 <Space>
//                   Trade
//                 </Space>
//               </a>
//             </Dropdown>

//             <Dropdown
//               overlayStyle={{ width: '100px', minWidth: '100px', textAlign: 'center' }}
//               menu={{ items: exploreItems }}
//               placement="bottom"
//               onOpenChange={(open) => {
//                 if (open) setHoveredNav('explore');
//                 else if (hoveredNav === 'explore') setHoveredNav(null);
//               }}
//             >
//               <a
//                 href="/#"
//                 style={{
//                   color: hoveredNav === 'explore' ? '#fff' : 'rgba(125, 125, 125, 1)',
//                   fontSize: '16px',
//                   padding: '0 15px',
//                   cursor: 'pointer',
//                   marginRight: '10px',
//                   textDecoration: 'none',
//                 }}
//                 onMouseEnter={() => setHoveredNav('explore')}
//                 onMouseLeave={() => !document.querySelector('.ant-dropdown:hover') && setHoveredNav(null)}
//               >
//                 <Space>
//                   Explore
//                 </Space>
//               </a>
//             </Dropdown>

//             <Dropdown
//               overlayStyle={{ width: '100px', minWidth: '100px', textAlign: 'center' }}
//               menu={{ items: poolItems }}
//               placement="bottom"
//               onOpenChange={(open) => {
//                 if (open) setHoveredNav('pool');
//                 else if (hoveredNav === 'pool') setHoveredNav(null);
//               }}
//             >
//               <a
//                 href="/"
//                 style={{
//                   color: hoveredNav === 'pool' ? '#fff' : 'rgba(125, 125, 125, 1)',
//                   fontSize: '16px',
//                   padding: '0 15px',
//                   cursor: 'pointer',
//                   marginRight: '10px',
//                   textDecoration: 'none',
//                 }}
//                 onMouseEnter={() => setHoveredNav('pool')}
//                 onMouseLeave={() => !document.querySelector('.ant-dropdown:hover') && setHoveredNav(null)}
//               >
//                 <Space>
//                   Pool
//                 </Space>
//               </a>
//             </Dropdown>
//           </div>
//         </div>
//         <WalletConnect onWalletConnected={onWalletConnected} />
//       </Header>
//       <Content style={{ padding: '20px', minHeight: 'calc(100vh - 64px)' }}>
//         {loading ? (
//           <p>正在加载合约...</p>
//         ) : isConnected ? (
//           <Routes>
//             <Route path="/buy" element={<BuyPage />} />
//             <Route path="/" element={<SwapPage />} />
//             <Route path="/history" element={<TransactionHistory />} />
//             <Route path="/pools" element={<Pools />} />
//             <Route path="/pools/:poolId" element={<PoolDetails />} />
//             <Route path="/tokens" element={<Tokens />} />
//             <Route path="/liquidity" element={<Liquidity />} />
//             <Route path="/transactions" element={<Transactions />} />
//           </Routes>
//         ) : (
//           <p>无法连接到合约，请确保已安装 MetaMask 并连接到正确的网络。</p>
//         )}
//       </Content>
//       <Drawer
//         title="Wallet"
//         placement="right"
//         onClose={closeDrawer}
//         open={isDrawerVisible}
//         width={350}
//         extra={
//           <PoweroffOutlined
//             style={{ fontSize: '24px', color: 'rgba(202, 213, 46, 1)', cursor: 'pointer' }}
//             onClick={handleDisconnect} // 修改为新的处理函数
//           />}>
//         <div style={{ textAlign: 'center', marginBottom: '20px' }}>
//           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
//             <img
//               src="/shit2.png"
//               alt="Avatar"
//               style={{
//                 width: '40px',
//                 height: '40px',
//                 borderRadius: '50%',
//                 marginRight: '10px',
//               }}
//             />
//             <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
//               {walletAddress ? formatAddress(walletAddress) : '未连接'}
//             </div>
//           </div>
//           <div style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>$0.00</div>
//           <div style={{ color: 'Khaki', fontSize: '16px' }}>▲ 0.00%</div>
//         </div>
//         <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
//           <div style={{
//             ...customButtonStyle,
//             ...(hoveredButton === 'buy' ? customButtonHoverStyle : {}),
//           }}
//             onMouseEnter={() => setHoveredButton('buy')}
//             onMouseLeave={() => setHoveredButton(null)}
//             onClick={() => {
//               closeDrawer();
//               navigate('/buy');
//             }}>
//             <div style={iconStyle}>
//               <BankOutlined />
//             </div>
//             <div style={textStyle}>Buy</div>
//           </div>
//           <div style={{
//             ...customButtonStyle,
//             ...(hoveredButton === 'receive' ? customButtonHoverStyle : {}),
//           }}
//             onMouseEnter={() => setHoveredButton('receive')}
//             onMouseLeave={() => setHoveredButton(null)}>
//             <div style={iconStyle}>
//               <DeliveredProcedureOutlined />
//             </div>
//             <div style={textStyle}>Receive</div>
//           </div>
//         </div>
//         <div style={{ textAlign: 'center', marginTop: '20px', padding: '0 20px' }}>
//           <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Welcome to your wallet!</h3>
//           <p style={{ fontSize: '14px', color: '#666' }}>
//             Looks like you have a new wallet. Let's get it funded before you make your first swap.
//           </p>
//         </div>
//         <div style={{ margin: '20px 0' }}>
//           <h4 style={{ marginBottom: '12px', color: '#666' }}>代币余额</h4>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
//             {/* ETH */}
//             <div style={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//               padding: '10px',
//               border: '1px solid #ddd',
//               borderRadius: '8px',
//               backgroundColor: '#f9f9f9',
//             }}>
//               <div style={{ display: 'flex', alignItems: 'center' }}>
//                 <img
//                   src="/icons/eth.png" // 替换为你的 ETH 图标路径
//                   alt="ETH"
//                   style={{ width: '24px', height: '24px', marginRight: '10px' }}
//                 />
//                 <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Ethereum</span>
//               </div>
//               <div style={{ textAlign: 'right' }}>
//                 <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{tokenBalances.eth?.amount || '0.00'} ETH</div>
//                 <div style={{ fontSize: '12px', color: '#888' }}>${tokenBalances.eth?.usd || '0.00'}</div>
//               </div>
//             </div>

//             {/* USDT */}
//             <div style={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//               padding: '10px',
//               border: '1px solid #ddd',
//               borderRadius: '8px',
//               backgroundColor: '#f9f9f9',
//             }}>
//               <div style={{ display: 'flex', alignItems: 'center' }}>
//                 <img
//                   src="/icons/usdt.png" // 替换为你的 USDT 图标路径
//                   alt="USDT"
//                   style={{ width: '24px', height: '24px', marginRight: '10px' }}
//                 />
//                 <span style={{ fontWeight: 'bold', fontSize: '16px' }}>USDT</span>
//               </div>
//               <div style={{ textAlign: 'right' }}>
//                 <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{tokenBalances.usdt?.amount || '0.00'} USDT</div>
//                 <div style={{ fontSize: '12px', color: '#888' }}>${tokenBalances.usdt?.usd || '0.00'}</div>
//               </div>
//             </div>

//             {/* DAI */}
//             <div style={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//               padding: '10px',
//               border: '1px solid #ddd',
//               borderRadius: '8px',
//               backgroundColor: '#f9f9f9',
//             }}>
//               <div style={{ display: 'flex', alignItems: 'center' }}>
//                 <img
//                   src="/icons/dai.png" // 替换为你的 DAI 图标路径
//                   alt="DAI"
//                   style={{ width: '24px', height: '24px', marginRight: '10px' }}
//                 />
//                 <span style={{ fontWeight: 'bold', fontSize: '16px' }}>DAI</span>
//               </div>
//               <div style={{ textAlign: 'right' }}>
//                 <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{tokenBalances.dai?.amount || '0.00'} DAI</div>
//                 <div style={{ fontSize: '12px', color: '#888' }}>${tokenBalances.dai?.usd || '0.00'}</div>
//               </div>
//             </div>

//             {/* SHIT */}
//             <div style={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//               padding: '10px',
//               border: '1px solid #ddd',
//               borderRadius: '8px',
//               backgroundColor: '#f9f9f9',
//             }}>
//               <div style={{ display: 'flex', alignItems: 'center' }}>
//                 <img
//                   src="/icons/shit.png" // 替换为你的 SHIT 图标路径
//                   alt="SHIT"
//                   style={{ width: '24px', height: '24px', marginRight: '10px' }}
//                 />
//                 <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SHIT</span>
//               </div>
//               <div style={{ textAlign: 'right' }}>
//                 <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{tokenBalances.shit?.amount || '0.00'} SHIT</div>
//                 <div style={{ fontSize: '12px', color: '#888' }}>${tokenBalances.shit?.usd || '0.00'}</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Drawer>
//     </Layout>
//   );
// }

// // 外层组件提供上下文
// function App() {
//   return (
//     <ConfigProvider>
//       <WalletProvider>
//         <Router><AppContent /></Router>
//       </WalletProvider></ConfigProvider>
//   );
// }

// export default App;

import { TransactionProvider } from './contexts/TransactionContext';
import React, { useState, useEffect } from 'react';
import { ConfigProvider, Layout, Dropdown, Space, Drawer } from 'antd';
import { useNavigate, Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { WalletProvider, useWallet } from './contexts/WalletContext';
import WalletConnect from './components/WalletConnect';
import SwapPage from './components/SwapPage';
import Pools from './components/Pools';
import BuyPage from './components/BuyPage';
import PoolDetails from './components/PoolDetails';
import Tokens from './components/Tokens';
import Liquidity from './components/Liquidity';
import RemoveLiquidity from './components/RemoveLiquidity';
import Transactions from './components/Transactions';
import TransactionHistory from './components/TransactionHistory';
import {
  DeliveredProcedureOutlined,
  BankOutlined,
  PoweroffOutlined,
  MinusOutlined // 新增图标用于移除流动性
} from '@ant-design/icons';

const { Header, Content } = Layout;

// 内部组件使用钱包上下文
function AppContent() {
  const navigate = useNavigate();
  const { walletAddress, formatAddress, loading, isConnected, disconnectWallet, tokenBalances, fetchTokenBalances } = useWallet();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);

  const handleDisconnect = () => {
    disconnectWallet();
    closeDrawer();
  };

  const onWalletConnected = (connected) => {
    if (connected) {
      setIsDrawerVisible(true);
    }
  };

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

  // 定义导航菜单项
  const tradeItems = [
    { key: 'swap', label: 'Swap' },
    { key: 'limit', label: 'Limit' },
    { key: 'send', label: 'Send' },
    { key: 'buy', label: <a href="/#" onClick={() => navigate('/buy')}>Buy</a> },
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

  useEffect(() => {
    if (isDrawerVisible) {
      fetchTokenBalances();
    }
  }, [isDrawerVisible, fetchTokenBalances]);

  return (
    <Layout>
      <Header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a href="/" style={{ textDecoration: 'none' }}>
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
          </a>

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
        ) : isConnected ? (
          <Routes>
            <Route path="/buy" element={<BuyPage />} />
            <Route path="/" element={<SwapPage />} />
            <Route path="/history" element={<TransactionHistory />} />
            <Route path="/pools" element={<Pools />} />
            <Route path="/pools/:poolId" element={<PoolDetails />} />
            <Route path="/tokens" element={<Tokens />} />
            <Route path="/liquidity" element={<Liquidity />} />
            <Route path="/remove-liquidity" element={<RemoveLiquidity />} /> {/* 新增移除流动性路由 */}
            <Route path="/transactions" element={<Transactions />} />
          </Routes>
        ) : (
          <p>无法连接到合约，请确保已安装 MetaMask 并连接到正确的网络。</p>
        )}
      </Content>
      <Drawer
        title="Wallet"
        placement="right"
        onClose={closeDrawer}
        open={isDrawerVisible}
        width={350}
        extra={
          <PoweroffOutlined
            style={{ fontSize: '24px', color: 'rgba(202, 213, 46, 1)', cursor: 'pointer' }}
            onClick={handleDisconnect}
          />
        }
      >
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
              {walletAddress ? formatAddress(walletAddress) : '未连接'}
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>$0.00</div>
          <div style={{ color: 'Khaki', fontSize: '16px' }}>▲ 0.00%</div>
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
          {/* 新增 Remove Liquidity 按钮 */}
          <div
            style={{
              ...customButtonStyle,
              ...(hoveredButton === 'remove' ? customButtonHoverStyle : {}),
            }}
            onMouseEnter={() => setHoveredButton('remove')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => {
              closeDrawer();
              navigate('/remove-liquidity');
            }}
          >
            <div style={iconStyle}>
              <MinusOutlined />
            </div>
            <div style={textStyle}>Remove</div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '20px', padding: '0 20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Welcome to your wallet!</h3>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Looks like you have a new wallet. Let's get it funded before you make your first swap.
          </p>
        </div>
        <div style={{ margin: '20px 0' }}>
          <h4 style={{ marginBottom: '12px', color: '#666' }}>代币余额</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* ETH */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src="/icons/eth.png"
                  alt="ETH"
                  style={{ width: '24px', height: '24px', marginRight: '10px' }}
                />
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Ethereum</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{tokenBalances.eth?.amount || '0.00'} ETH</div>
                <div style={{ fontSize: '12px', color: '#888' }}>${tokenBalances.eth?.usd || '0.00'}</div>
              </div>
            </div>

            {/* USDT */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src="/icons/usdt.png"
                  alt="USDT"
                  style={{ width: '24px', height: '24px', marginRight: '10px' }}
                />
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>USDT</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{tokenBalances.usdt?.amount || '0.00'} USDT</div>
                <div style={{ fontSize: '12px', color: '#888' }}>${tokenBalances.usdt?.usd || '0.00'}</div>
              </div>
            </div>

            {/* DAI */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src="/icons/dai.png"
                  alt="DAI"
                  style={{ width: '24px', height: '24px', marginRight: '10px' }}
                />
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>DAI</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{tokenBalances.dai?.amount || '0.00'} DAI</div>
                <div style={{ fontSize: '12px', color: '#888' }}>${tokenBalances.dai?.usd || '0.00'}</div>
              </div>
            </div>

            {/* SHIT */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src="/icons/shit.png"
                  alt="SHIT"
                  style={{ width: '24px', height: '24px', marginRight: '10px' }}
                />
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SHIT</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{tokenBalances.shit?.amount || '0.00'} SHIT</div>
                <div style={{ fontSize: '12px', color: '#888' }}>${tokenBalances.shit?.usd || '0.00'}</div>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </Layout>
  );
}

// 外层组件提供上下文
function App() {
  return (
    <ConfigProvider>
      <WalletProvider>
      <TransactionProvider>
        <Router><AppContent /></Router></TransactionProvider>
      </WalletProvider>
    </ConfigProvider>
  );
}

export default App;
