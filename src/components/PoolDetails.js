import React, { useState, useEffect } from 'react';
import { Dropdown, Button, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import VolumePage from './VolumePage';
import HistoryPricePage from './HistoryPricePage';
import CandlestickPage from './CandlestickPage';
import TransactionHistory from './TransactionHistory';
import Action from './Action'; 

const PoolDetails = () => {
    const [selectedPage, setSelectedPage] = useState('Volume'); // 默认显示 VolumePage
    const [timeRange, setTimeRange] = useState('1D'); // 默认时间范围
    const [historyPriceData, setHistoryPriceData] = useState([]);
    const [volumeData, setVolumeData] = useState([]);
    const [candlestickData, setCandlestickData] = useState([]);
    const stats = {
        poolBalances: { usdc: '20.5M', eth: '69.5K' },
        tvl: '$144.5M',
        tvlChange: 0.14,
        volume: '$187.7M',
        volumeChange: -28.05,
        fees: '$93.8K',
      };
    // 定义菜单项
    const menu = (
        <Menu
            onClick={(e) => setSelectedPage(e.key)} // 切换页面
            items={[
                { key: 'Volume', label: 'Volume' },
                { key: 'Price', label: 'Price' },
                { key: 'CandleStick', label: 'CandleStick' },
            ]}
        />
    );
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
        <div style={{ display: 'flex', padding: '20px' }}>
      {/* 左侧内容 */}
      <div style={{ flex: 3, marginRight: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Dropdown overlay={menu} trigger={['click']}>
            <Button>
              {selectedPage} <DownOutlined />
            </Button>
          </Dropdown>
        </div>

        {/* 根据 selectedPage 显示不同的页面 */}
        {selectedPage === 'Volume' && <VolumePage data={volumeData} timeRange={timeRange} setTimeRange={setTimeRange} />}
        {selectedPage === 'Price' && <HistoryPricePage data={historyPriceData} timeRange={timeRange} setTimeRange={setTimeRange} />}
        {selectedPage === 'CandleStick' && <CandlestickPage data={candlestickData} timeRange={timeRange} setTimeRange={setTimeRange} />}
        {<TransactionHistory />}
      </div>

      {/* 右侧内容 */}
      <div style={{ flex: 1 }}>
        <Action stats={stats}  /> {/* 放置 Action 组件 */}
      </div>
    </div>
    );
};

export default PoolDetails;