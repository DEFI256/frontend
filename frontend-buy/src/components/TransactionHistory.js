import React from 'react';
import { Table } from 'antd';

function TransactionHistory() {
  const columns = [
    { title: 'Time', dataIndex: 'time', key: 'time' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'USD', dataIndex: 'usd', key: 'usd' },
    { title: 'TokenA', dataIndex: 'tokena', key: 'tokena' },
    { title: 'TokenB', dataIndex: 'tokenb', key: 'tokenb' },
    { title: 'Wallet', dataIndex: 'wallet', key: 'wallet' },
  ];

  const data = [
    {
      key: '1',
      type: 'sell eth',
      time: '2025-03-22 10:00',
      usd: '2488',
      tokena: '1',
      tokenb: '1.01',
      wallet: '0x23817349',
    },
  ];

  return <Table columns={columns} dataSource={data} style={{ margin: '20px' }} />;
}

export default TransactionHistory;