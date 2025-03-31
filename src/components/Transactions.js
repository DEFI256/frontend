import React from 'react';
import { Table, Typography, Avatar } from 'antd';

const { Text } = Typography;

function Transaction() {
  // 定义表格的列
  const columns = [
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={record.iconFrom} size="small" style={{ marginRight: 8 }} />
          <Text>{text}</Text>
        </div>
      ),
    },
    {
      title: 'USD',
      dataIndex: 'usd',
      key: 'usd',
    },
    {
      title: 'Token amount',
      dataIndex: 'tokenAmount',
      key: 'tokenAmount',
      render: (text, record) => (
        <div>
          <Text>{text}</Text>
          <Avatar src={record.iconTo} size="small" style={{ marginLeft: 8 }} />
        </div>
      ),
    },
    {
      title: 'Wallet',
      dataIndex: 'wallet',
      key: 'wallet',
    },
  ];

  // 生成假数据
  const data = [
    {
      key: '1',
      time: '21s ago',
      type: 'Swap ETH for WBTC',
      iconFrom: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      iconTo: 'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png',
      usd: '$2,014.08',
      tokenAmount: '0.024 WBTC',
      wallet: '0xD1Fa...0cB7',
    },
    {
      key: '2',
      time: '21s ago',
      type: 'Swap ETH for AAVE',
      iconFrom: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      iconTo: 'https://cryptologos.cc/logos/aave-aave-logo.png',
      usd: '$519.32',
      tokenAmount: '3.17 AAVE',
      wallet: '0xD1Fa...0cB7',
    },
    {
      key: '3',
      time: '21s ago',
      type: 'Swap ETH for USDT',
      iconFrom: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      iconTo: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
      usd: '$1,049.77',
      tokenAmount: '1,052.41 USDT',
      wallet: '0xD1Fa...0cB7',
    },
    {
      key: '4',
      time: '21s ago',
      type: 'Swap ETH for ONDO',
      iconFrom: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      iconTo: 'https://via.placeholder.com/32', // 替换为 ONDO 图标
      usd: '$823.41',
      tokenAmount: '1,036.47 ONDO',
      wallet: '0x2e89...d8d9',
    },
    {
      key: '5',
      time: '21s ago',
      type: 'Swap USDC for ETH',
      iconFrom: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
      iconTo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      usd: '$60,263.28',
      tokenAmount: '33.19 ETH',
      wallet: '0xfc80...9142',
    },
    {
      key: '6',
      time: '21s ago',
      type: 'Swap ETH for USDT',
      iconFrom: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      iconTo: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
      usd: '$3,079.09',
      tokenAmount: '3,082.55 USDT',
      wallet: '0x0080...60fC',
    },
    {
      key: '7',
      time: '21s ago',
      type: 'Swap pxETH for ETH',
      iconFrom: 'https://via.placeholder.com/32', // 替换为 pxETH 图标
      iconTo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      usd: '$28,652.59',
      tokenAmount: '15.81 ETH',
      wallet: '0x0080...60fC',
    },
    {
      key: '8',
      time: '21s ago',
      type: 'Swap ETH for LAKE',
      iconFrom: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      iconTo: 'https://via.placeholder.com/32', // 替换为 LAKE 图标
      usd: '$90.69',
      tokenAmount: '60,815.07 LAKE',
      wallet: '0x481a...243e',
    },
    {
      key: '9',
      time: '21s ago',
      type: 'Swap USDC for ETH',
      iconFrom: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
      iconTo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      usd: '$19.29',
      tokenAmount: '19.31 USDC',
      wallet: '0xD36F...5F01',
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: '20px' }}>
        Transaction History
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

export default Transaction;