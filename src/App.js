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
      // 原始模拟数据
      const rawCandlestickData = [
        ['2025-03-28 00:00', [1900, 1950, 1880, 2300]],
        ['2025-03-28 01:00', [2301, 2400, 2250, 2100]],
        ['2025-03-28 02:00', [2100, 2150, 2050, 2500]],
        ['2025-03-28 03:00', [2500, 2400, 2400, 2400]],
        ['2025-03-28 04:00', [2400, 2450, 2350, 2900]],
        ['2025-03-29 08:00', [3000, 3050, 2950, 3400]],
        ['2025-04-30 14:00', [3900, 3950, 3850, 4300]],
        ['2025-05-01 16:00', [4200, 4170, 4150, 4600]],
        ['2026-04-30 17:00', [4600, 4650, 4550, 4500]],
        ['2027-04-30 18:00', [3455, 5650, 3350, 5650]],
      ];

      // 数据聚合函数
      const aggregateData = (rawData, frame) => {
        const aggregated = {};
        const parseTime = (timeStr) => new Date(timeStr);

        rawData.forEach(([time, values]) => {
          const date = parseTime(time);
          let key;

          switch (frame) {
            case '1H':
              key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`;
              break;
            case '1D':
              key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
              break;
            case '1W':
              const weekStart = new Date(date);
              weekStart.setDate(date.getDate() - date.getDay() + 1);
              key = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`;
              break;
            case '1M':
              key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
              break;
            case '1Y':
              key = `${date.getFullYear()}`;
              break;
            default:
              key = time;
          }

          if (!aggregated[key]) {
            aggregated[key] = {
              open: values[0],
              close: values[1],
              low: values[2],
              high: values[3],
              times: [],
            };
          } else {
            aggregated[key].close = values[1];
            aggregated[key].low = Math.min(aggregated[key].low, values[2]);
            aggregated[key].high = Math.max(aggregated[key].high, values[3]);
          }
          aggregated[key].times.push(date);
        });

        return Object.entries(aggregated)
          .sort((a, b) => new Date(a[0]) - new Date(b[0]))
          .map(([time, { open, close, low, high }]) => [time, [open, close, low, high]]);
      };

      // 根据 timeRange 聚合 candlestickData
      const processedCandlestickData = aggregateData(rawCandlestickData, timeRange);
      setCandlestickData(processedCandlestickData);

      // 更新其他数据
      setHistoryPriceData([...processedCandlestickData].map(([time, [open]]) => ({ time, price: open })));
      setVolumeData([...processedCandlestickData].map(([time]) => ({ time, volume: Math.random() * 5000 })));
    };

    fetchData();
  }, [timeRange]);

  return (
    <Router>
      <Layout>
        <Header style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px', width: '100%', overflow: 'visible' }}>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['swap']} style={{ flex: 1, minWidth: 0, overflow: 'visible' }}>
            <Menu.Item key="swap"><Link to="/">Swap</Link></Menu.Item>
            <Menu.Item key="history-price"><Link to="/history-price">HistoryPrice</Link></Menu.Item>
            <Menu.Item key="volume"><Link to="/volume">Volume</Link></Menu.Item>
            <Menu.Item key="candlestick"><Link to="/candlestick">CandlestickChart</Link></Menu.Item>
            <Menu.Item key="transaction-history"><Link to="/transaction-history">TransactionHistory</Link></Menu.Item>
          </Menu>
          <WalletConnect />
        </Header>
        <Content style={{ padding: '20px', minHeight: 'calc(100vh - 64px)' }}>
          {loading ? (
            <p>正在加载合约...</p>
          ) : swapContract ? (
            <Routes>
              <Route path="/" element={<Swap swapContract={swapContract} />} />
              <Route path="/history-price" element={<HistoryPricePage data={historyPriceData} timeRange={timeRange} setTimeRange={setTimeRange} />} />
              <Route path="/volume" element={<VolumePage data={volumeData} timeRange={timeRange} setTimeRange={setTimeRange} />} />
              <Route path="/candlestick" element={<CandlestickPage data={candlestickData} timeRange={timeRange} setTimeRange={setTimeRange} />} />
              <Route path="/transaction-history" element={<TransactionHistory />} />
            </Routes>
          ) : (
            <p>无法连接到合约，请确保已安装 MetaMask 并连接到正确的网络。</p>
          )}
        </Content>
      </Layout>
    </Router>
  );
}

export default App;