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


// import React, { useEffect, useState } from 'react';
// import { Table } from 'antd';
// import { ethers } from 'ethers';
// import StableSwapPoolABI from '../abis/StableSwapPool.json'; // 导入 ABI

// function TransactionHistory() {
//   const [transactions, setTransactions] = useState([]);

//   // 合约地址（替换为你在 Ganache 部署后得到的地址）
//   const contractAddress = '0xEdF882c5203130b032fBad5C4154f8C0655a0A10'; // 从 truffle migrate 输出中获取

//   // 初始化 provider（连接到 Ganache）
//   const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545'); // Ganache GUI 默认端口
//   const contract = new ethers.Contract(contractAddress, StableSwapPoolABI.abi, provider);

//   // 格式化时间戳
//   const formatTimestamp = (timestamp) => {
//     const date = new Date(Number(timestamp) * 1000);
//     return date.toLocaleString();
//   };

//   // 获取交易记录
//   useEffect(() => {
//     const fetchTransactions = async () => {
//       try {
//         const filter = contract.filters.SwapDetailed();
//         const events = await contract.queryFilter(filter, 0); // 从创世区块开始查询

//         const formattedTransactions = events.map((event, index) => {
//           const { timestamp, user, feeAmount, amountAfterFee, priceImpact } = event.args;
//           return {
//             key: index.toString(),
//             time: formatTimestamp(timestamp),
//             type: 'Swap',
//             usd: 'N/A',
//             tokena: ethers.formatUnits(amountAfterFee, 18),
//             tokenb: 'N/A',
//             wallet: user.slice(0, 6) + '...' + user.slice(-4),
//             fee: ethers.formatUnits(feeAmount, 18),
//             priceImpact: Number(priceImpact) / 100 + '%',
//           };
//         });

//         setTransactions(formattedTransactions.reverse());
//       } catch (error) {
//         console.error('Error fetching transactions:', error);
//       }
//     };

//     fetchTransactions();

//     // 实时监听
//     contract.on('SwapDetailed', (timestamp, user, feeAmount, amountAfterFee, priceImpact) => {
//       const newTransaction = {
//         key: transactions.length.toString(),
//         time: formatTimestamp(timestamp),
//         type: 'Swap',
//         usd: 'N/A',
//         tokena: ethers.formatUnits(amountAfterFee, 18),
//         tokenb: 'N/A',
//         wallet: user.slice(0, 6) + '...' + user.slice(-4),
//         fee: ethers.formatUnits(feeAmount, 18),
//         priceImpact: Number(priceImpact) / 100 + '%',
//       };
//       setTransactions((prev) => [newTransaction, ...prev]);
//     });

//     return () => {
//       contract.removeAllListeners('SwapDetailed');
//     };
//   }, []);

//   const columns = [
//     { title: 'Time', dataIndex: 'time', key: 'time' },
//     { title: 'Type', dataIndex: 'type', key: 'type' },
//     { title: 'USD', dataIndex: 'usd', key: 'usd' },
//     { title: 'Token A', dataIndex: 'tokena', key: 'tokena' },
//     { title: 'Token B', dataIndex: 'tokenb', key: 'tokenb' },
//     { title: 'Wallet', dataIndex: 'wallet', key: 'wallet' },
//     { title: 'Fee', dataIndex: 'fee', key: 'fee' },
//     { title: 'Price Impact', dataIndex: 'priceImpact', key: 'priceImpact' },
//   ];

//   console.log('StableSwapPoolABI:', StableSwapPoolABI);

//   return <Table columns={columns} dataSource={transactions} style={{ margin: '20px' }} />;
// }

// export default TransactionHistory;