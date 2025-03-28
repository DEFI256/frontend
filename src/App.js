import React, { useEffect, useState } from 'react';
import { Layout, message, Menu } from 'antd';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { ethers } from 'ethers';
import WalletConnect from './components/WalletConnect';
import Swap from './components/Swap';
import TransactionHistory from './components/TransactionHistory';
import HistoryPricePage from './components/HistoryPricePage';
import VolumePage from './components/VolumePage';
import CandlestickPage from './components/CandlestickPage';
import SwapABI from './abis/Swap.json';

const { Header, Content } = Layout;

const SWAP_ADDRESS = '0x123456789012345678901234567890123456789A';

function App() {
  const [swapContract, setSwapContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('1D');
  const [historyPriceData, setHistoryPriceData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [candlestickData, setCandlestickData] = useState([]);

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

  useEffect(() => {
    const fetchData = () => {
      // 模拟数据，实际项目中需要通过 swapContract 或 API 获取数据
      setHistoryPriceData([
        { time: '2025-03-28 20:00', price: 1909.15 },
        { time: '2025-03-28 02:00', price: 1950.00 },
        { time: '2025-03-28 14:00', price: 1875.00 },
      ]);

      setVolumeData([
        { time: '2025-03-28 17:36', volume: 2000 },
        { time: '2025-03-28 20:36', volume: 3000 },
        { time: '2025-03-28 11:36', volume: 5000 },
      ]);

      setCandlestickData([
        ['2025-03-28 00:00', [1900, 1950, 1880, 2300]], // 开盘价 1900，收盘价 2300（上涨）
    ['2025-03-28 01:00', [2300, 2400, 2250, 2100]], // 开盘价 2300，收盘价 2100（下跌）
    ['2025-03-28 02:00', [2100, 2150, 2050, 2500]], // 开盘价 2100，收盘价 2500（上涨）
    ['2025-03-28 03:00', [2500, 2600, 2400, 2400]], // 开盘价 2500，收盘价 2400（下跌）
    ['2025-03-28 04:00', [2400, 2450, 2350, 2900]], // 开盘价 2400，收盘价 2900（上涨）
    ['2025-03-28 05:00', [2900, 2950, 2800, 2700]], // 开盘价 2900，收盘价 2700（下跌）
    ['2025-03-28 06:00', [2700, 2750, 2650, 3100]], // 开盘价 2700，收盘价 3100（上涨）
    ['2025-03-28 07:00', [3100, 3150, 3050, 3000]], // 开盘价 3100，收盘价 3000（下跌）
    ['2025-03-28 08:00', [3000, 3050, 2950, 3400]], // 开盘价 3000，收盘价 3400（上涨）
    ['2025-03-28 09:00', [3400, 3450, 3350, 3300]], // 开盘价 3400，收盘价 3300（下跌）
    ['2025-03-28 10:00', [3300, 3350, 3250, 3700]], // 开盘价 3300，收盘价 3700（上涨）
    ['2025-03-28 11:00', [3700, 3750, 3650, 3600]], // 开盘价 3700，收盘价 3600（下跌）
    ['2025-03-28 12:00', [3600, 3650, 3550, 4000]], // 开盘价 3600，收盘价 4000（上涨）
    ['2025-03-28 13:00', [4000, 4050, 3950, 3900]], // 开盘价 4000，收盘价 3900（下跌）
    ['2025-03-28 14:00', [3900, 3950, 3850, 4300]], // 开盘价 3900，收盘价 4300（上涨）
    ['2025-03-28 15:00', [4300, 4350, 4250, 4200]], // 开盘价 4300，收盘价 4200（下跌）
    ['2025-03-28 16:00', [4200, 4250, 4150, 4600]], // 开盘价 4200，收盘价 4600（上涨）
    ['2025-03-28 17:00', [4600, 4650, 4550, 4500]], // 开盘价 4600，收盘价 4500（下跌）
    ['2025-03-28 18:00', [4500, 4550, 4450, 4900]], // 开盘价 4500，收盘价 4900（上涨）
    ['2025-03-28 19:00', [4900, 4950, 4850, 4800]], // 开盘价 4900，收盘价 4800（下跌）
    ['2025-03-28 20:00', [4800, 4850, 4750, 5200]], // 开盘价 4800，收盘价 5200（上涨）,
    ]);
    };

    fetchData();
  }, [timeRange]);

  return (
    <Router>
      <Layout>
        <Header style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px' }}>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['swap']}>
            <Menu.Item key="swap">
              <Link to="/">Swap</Link>
            </Menu.Item>
            <Menu.Item key="history-price">
              <Link to="/history-price">历史价格</Link>
            </Menu.Item>
            <Menu.Item key="volume">
              <Link to="/volume">交易量</Link>
            </Menu.Item>
            <Menu.Item key="candlestick">
              <Link to="/candlestick">K 线图</Link>
            </Menu.Item>
            <Menu.Item key="transaction-history">
              <Link to="/transaction-history">交易历史</Link>
            </Menu.Item>
          </Menu>
          <WalletConnect />
        </Header>
        <Content style={{ padding: '20px', minHeight: 'calc(100vh - 64px)' }}>
          {loading ? (
            <p>正在加载合约...</p>
          ) : swapContract ? (
            <Routes>
              <Route
                path="/"
                element={<Swap swapContract={swapContract} />}
              />
              <Route
                path="/history-price"
                element={
                  <HistoryPricePage
                    data={historyPriceData}
                    timeRange={timeRange}
                    setTimeRange={setTimeRange}
                  />
                }
              />
              <Route
                path="/volume"
                element={
                  <VolumePage
                    data={volumeData}
                    timeRange={timeRange}
                    setTimeRange={setTimeRange}
                  />
                }
              />
              <Route
                path="/candlestick"
                element={
                  <CandlestickPage
                    data={candlestickData}
                    timeRange={timeRange}
                    setTimeRange={setTimeRange}
                  />
                }
              />
              <Route
                path="/transaction-history"
                element={<TransactionHistory />}
              />
            </Routes>
          ) : (
            <p>无法连接到合约，请确保已安装 MetaMask 并连接到正确的网络。</p>
          )}
        </Content>
      </Layout>
    </Router>
  // <Routes>
  //   <Route path="/test" element={<div>Test Page</div>} />
  // </Routes>

  );
}

export default App;