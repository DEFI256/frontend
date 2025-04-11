import React from 'react';
import { Table, Typography, Avatar } from 'antd';

const { Text } = Typography;

function Tokens() {
  // 定义表格的列
  const columns = [
    {
      title: '#',
      dataIndex: 'rank',
      key: 'rank',
    },
    {
      title: 'Token name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={record.icon} size="small" style={{ marginRight: 8 }} />
          <Text>{text}</Text>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '1 hour',
      dataIndex: 'hourChange',
      key: 'hourChange',
      render: (text) => (
        <Text style={{ color: text.startsWith('-') ? 'red' : 'green' }}>{text}</Text>
      ),
    },
    {
      title: '1 day',
      dataIndex: 'dayChange',
      key: 'dayChange',
      render: (text) => (
        <Text style={{ color: text.startsWith('-') ? 'red' : 'green' }}>{text}</Text>
      ),
    },
    {
      title: 'FDV',
      dataIndex: 'fdv',
      key: 'fdv',
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      key: 'volume',
    },
  ];

  // 生成假数据
  const data = [
    {
      key: '1',
      rank: 1,
      name: 'ETH',
      icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      price: '$1,802.15',
      hourChange: '+0.62%',
      dayChange: '-0.56%',
      fdv: '$5.2B',
      volume: '$32.5M',
    },
    {
      key: '2',
      rank: 2,
      name: 'USDC',
      icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
      price: '$1.00',
      hourChange: '+0.00%',
      dayChange: '+0.00%',
      fdv: '$60.2B',
      volume: '$21.1M',
    },
    {
      key: '3',
      rank: 3,
      name: 'USDT',
      icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
      price: '$1.00',
      hourChange: '+0.00%',
      dayChange: '+0.00%',
      fdv: '$144.1B',
      volume: '$15.3M',
    },
    {
      key: '4',
      rank: 4,
      name: 'WBTC',
      icon: 'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png',
      price: '$82,446.70',
      hourChange: '+0.32%',
      dayChange: '+0.49%',
      fdv: '$10.6B',
      volume: '$5.1M',
    },
    {
      key: '5',
      rank: 5,
      name: 'weETH',
      icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      price: '$1,916.39',
      hourChange: '+0.62%',
      dayChange: '-0.53%',
      fdv: '$4.1B',
      volume: '$4.5M',
    },
    {
      key: '6',
      rank: 6,
      name: 'UNI',
      icon: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
      price: '$6.12',
      hourChange: '+0.45%',
      dayChange: '+0.78%',
      fdv: '$3.2B',
      volume: '$2.3M',
    },
    {
      key: '7',
      rank: 7,
      name: 'MATIC',
      icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
      price: '$1.12',
      hourChange: '+0.12%',
      dayChange: '+0.34%',
      fdv: '$8.4B',
      volume: '$1.8M',
    },
    {
      key: '8',
      rank: 8,
      name: 'LINK',
      icon: 'https://cryptologos.cc/logos/chainlink-link-logo.png',
      price: '$7.45',
      hourChange: '+0.23%',
      dayChange: '-0.12%',
      fdv: '$3.6B',
      volume: '$1.2M',
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: '20px' }}>
        Token List
      </Typography.Title>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
        bordered
        style={{ backgroundColor: '#fff', borderRadius: '8px' }}
      />
    </div>
  );
}

export default Tokens;