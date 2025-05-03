import React, { useState, useEffect } from 'react';
import { Table, Select, Typography, Tag, Space, Empty } from 'antd';
import { useTransactions, POOL_TYPES, getPoolName } from '../contexts/TransactionContext';

const { Option } = Select;
const { Title } = Typography;

const TransactionHistory = ({ poolType: initialPoolType }) => {
  const { getTransactions, getAllTransactions } = useTransactions();
  const [selectedPool, setSelectedPool] = useState(initialPoolType || 'all');
  const [transactions, setTransactions] = useState([]);

  // 当 initialPoolType 或 selectedPool 变化时更新选择的池子
  useEffect(() => {
    if (initialPoolType && initialPoolType !== selectedPool) {
      setSelectedPool(initialPoolType);
    }
  }, [initialPoolType, selectedPool]);

  // 根据选择的池子加载交易数据
  useEffect(() => {
    const loadTransactions = () => {
      console.log("Loading transactions for pool:", selectedPool);
      let txs = [];
      
      if (selectedPool === 'all') {
        txs = getAllTransactions();
      } else {
        txs = getTransactions(selectedPool);
      }
      
      console.log("Loaded transactions:", txs.length);
      setTransactions(txs);
    };
    
    loadTransactions();
    
    // 设置定期刷新
    const intervalId = setInterval(loadTransactions, 10000);
    return () => clearInterval(intervalId);
  }, [selectedPool, getTransactions, getAllTransactions]);

  // 显示调试信息
  console.log("TransactionHistory render. Selected pool:", selectedPool);
  console.log("Current transactions:", transactions);

  const columns = [
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text) => <span>{text}</span>,
    },
    {
      title: 'Type',
      key: 'type',
      dataIndex: 'type',
      render: (type) => (
        <Tag color={type === 'swap' ? 'green' : 'blue'}>
          {type ? type.toUpperCase() : 'UNKNOWN'}
        </Tag>
      ),
    },
    {
      title: 'Details',
      key: 'details',
      render: (_, record) => (
        <Space size="middle">
          <span>{record.tokenIn} → {record.tokenOut}</span>
          <span>{parseFloat(record.amountIn).toFixed(6)} → {parseFloat(record.amountOut).toFixed(6)}</span>
        </Space>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'priceCurrent',
      key: 'priceCurrent',
      render: (text) => <span>{parseFloat(text || 0).toFixed(6)}</span>,
    },
    {
      title: 'Transaction',
      key: 'transaction',
      render: (_, record) => (
        record.transactionHash ? (
          <a 
            href={`https://sepolia.etherscan.io/tx/${record.transactionHash}`} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            View
          </a>
        ) : <span>N/A</span>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={4}>Transaction History</Title>
      <div style={{ marginBottom: '20px' }}>
        <Select 
          value={selectedPool} 
          onChange={setSelectedPool}
          style={{ width: 200 }}
        >
          <Option value="all">All Pools</Option>
          {Object.keys(POOL_TYPES).map(key => (
            <Option key={key} value={POOL_TYPES[key]}>{getPoolName(POOL_TYPES[key])}</Option>
          ))}
        </Select>
      </div>
      
      {transactions && transactions.length > 0 ? (
        <Table 
          columns={columns} 
          dataSource={transactions.map((tx, index) => ({...tx, key: `${tx.transactionHash || ''}-${index}`}))}
          pagination={{ pageSize: 10 }} 
        />
      ) : (
        <Empty description="No transactions found" />
      )}
    </div>
  );
};

export default TransactionHistory;