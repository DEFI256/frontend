import React, { useEffect, useState } from 'react';
import { Table, Typography, Avatar, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { ethers } from 'ethers';

const { Text } = Typography;

function Pools() {
  const navigate = useNavigate();
  const { contracts } = useWallet(); // 从 WalletContext 获取合约
  const [loading, setLoading] = useState(true);
  const [poolData, setPoolData] = useState([]);

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
      title: 'Reserve A',
      dataIndex: 'reserveA',
      key: 'reserveA',
    },
    {
      title: 'Reserve B',
      dataIndex: 'reserveB',
      key: 'reserveB',
    },
    {
      title: 'Total Liquidity',
      dataIndex: 'totalLiquidity',
      key: 'totalLiquidity',
    },
    {
      title: 'Price (A/B)',
      dataIndex: 'price',
      key: 'price',
    },
  ];

  // 加载池子数据
  useEffect(() => {
    const fetchPoolData = async () => {
      if (!contracts) return;

      setLoading(true);

      try {
        const pools = [
          { index: 1, name: 'USDT/DAI', contract: contracts.usdtDaiPool, icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png' },
          { index: 2, name: 'USDT/ETH', contract: contracts.usdtEthPool, icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
          { index: 3, name: 'USDT/SHIT', contract: contracts.usdtShitPool, icon: 'https://via.placeholder.com/32' },
          { index: 4, name: 'DAI/ETH', contract: contracts.daiEthPool, icon: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png' },
          { index: 5, name: 'SHIT/ETH', contract: contracts.shitEthPool, icon: 'https://via.placeholder.com/32' },
          { index: 6, name: 'DAI/SHIT', contract: contracts.daiShitPool, icon: 'https://via.placeholder.com/32' },
        ];

        const ss= contracts.usdtDaiPool.getReservesAndLiquidity()
        console.log(ss, 333);
        

        const poolDataPromises = pools.map(async (pool) => {
          if (!pool.contract) return null;
        
          // 调用 getReservesAndLiquidity 接口
          const [reserveA, reserveB, totalLiquidity, priceCurrent] = await pool.contract.getReservesAndLiquidity();
        
          return {
            key: pool.index,
            pool: pool.name,
            icon: pool.icon,
            reserveA: `${ethers.formatUnits(reserveA.toString(), 18)} A`, // 直接使用后端返回的值
            reserveB: `${ethers.formatUnits(reserveB.toString(), 18)} B`, // 直接使用后端返回的值
            totalLiquidity: `${totalLiquidity.toString()}`, // 直接使用后端返回的值
            price: `${parseFloat(ethers.formatUnits(priceCurrent, 18)).toFixed(6)}`, // 假设价格仍然是 18 位小数
          };
        });

        const resolvedData = await Promise.all(poolDataPromises);
        setPoolData(resolvedData.filter((data) => data !== null)); // 过滤掉空数据
      } catch (error) {
        console.error('加载池子数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPoolData();
  }, [contracts]);

  return (
    <div style={{ padding: '20px' }}>
      <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: '20px' }}>
        Liquidity Pools
      </Typography.Title>
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={poolData}
          pagination={{ pageSize: 10 }}
          bordered
          style={{ backgroundColor: '#fff', borderRadius: '8px' }}
          onRow={(record) => ({
            onClick: () => navigate(`/pools/${record.key}`), // 跳转到池子详情页面
          })}
        />
      )}
    </div>
  );
}

export default Pools;