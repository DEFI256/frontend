import React from 'react';
import { Table } from 'antd';

function TransactionHistory() {
  const columns = [
    { title: 'Time', dataIndex: 'time', key: 'time' },
    { title: 'From', dataIndex: 'from', key: 'from' },
    { title: 'To', dataIndex: 'to', key: 'to' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
  ];

  const data = [
    {
      key: '1',
      time: '2025-03-22 10:00',
      from: 'TokenA',
      to: 'TokenB',
      amount: '10',
    },
  ];

  return <Table columns={columns} dataSource={data} style={{ margin: '20px' }} />;
}

export default TransactionHistory;