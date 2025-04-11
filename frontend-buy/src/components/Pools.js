import React from 'react';
import { Table, Typography, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Text } = Typography;

function Pools() {
    const navigate = useNavigate(); 
  // 定义表格的列
  const columns = [
    {
      title: 'Pool',
      dataIndex: 'pool',
      key: 'pool',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={record.icon} size="small" style={{ marginRight: 8 }} />
          <Text>{text}</Text>
        </div>
      ),
    },
    {
      title: 'TVL',
      dataIndex: 'tvl',
      key: 'tvl',
    },
    {
      title: 'APR',
      dataIndex: 'apr',
      key: 'apr',
    },
    {
      title: '1D vol',
      dataIndex: 'vol1d',
      key: 'vol1d',
    },
    {
      title: '30D vol',
      dataIndex: 'vol30d',
      key: 'vol30d',
    },
    {
      title: '1D vol/TVL',
      dataIndex: 'volTvlRatio',
      key: 'volTvlRatio',
    },
  ];

  // 生成假数据
  const data = [
    {
      key: '1',
      pool: 'USDC/ETH',
      icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
      tvl: '$154.6M',
      apr: '2.465%',
      vol1d: '$20.9M',
      vol30d: '$10.1B',
      volTvlRatio: '0.14',
    },
    {
      key: '2',
      pool: 'DAI/ETH',
      icon: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
      tvl: '$120.3M',
      apr: '3.125%',
      vol1d: '$15.2M',
      vol30d: '$8.7B',
      volTvlRatio: '0.13',
    },
    {
      key: '3',
      pool: 'WBTC/ETH',
      icon: 'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png',
      tvl: '$98.7M',
      apr: '1.875%',
      vol1d: '$12.4M',
      vol30d: '$6.5B',
      volTvlRatio: '0.12',
    },
    {
      key: '4',
      pool: 'UNI/ETH',
      icon: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
      tvl: '$75.4M',
      apr: '2.765%',
      vol1d: '$10.1M',
      vol30d: '$5.2B',
      volTvlRatio: '0.15',
    },
    {
      key: '5',
      pool: 'SHIT/ETH',
      icon: 'https://via.placeholder.com/32', // 替换为实际图标路径
      tvl: '$50.2M',
      apr: '4.125%',
      vol1d: '$8.3M',
      vol30d: '$3.8B',
      volTvlRatio: '0.16',
    },
    {
      key: '6',
      pool: 'USDT/ETH',
      icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
      tvl: '$200.1M',
      apr: '2.345%',
      vol1d: '$25.4M',
      vol30d: '$12.3B',
      volTvlRatio: '0.13',
    },
    {
      key: '7',
      pool: 'MATIC/ETH',
      icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
      tvl: '$65.8M',
      apr: '3.875%',
      vol1d: '$9.7M',
      vol30d: '$4.1B',
      volTvlRatio: '0.14',
    },
    {
      key: '8',
      pool: 'LINK/ETH',
      icon: 'https://cryptologos.cc/logos/chainlink-link-logo.png',
      tvl: '$80.4M',
      apr: '2.975%',
      vol1d: '$11.2M',
      vol30d: '$5.6B',
      volTvlRatio: '0.14',
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: '20px' }}>
        Liquidity Pools
      </Typography.Title>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
        bordered
        style={{ backgroundColor: '#fff', borderRadius: '8px' }}
        onRow={(record) => ({
            onClick: () => navigate(`/pools/${record.key}`), // 跳转到池子详情页面
          })}
      />
    </div>
  );
}

export default Pools;