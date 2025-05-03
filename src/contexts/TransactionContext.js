import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// 定义池子类型的常量
export const POOL_TYPES = {
  USDT_DAI: 'USDT_DAI',
  USDT_ETH: 'USDT_ETH',
  USDT_SHIT: 'USDT_SHIT',
  DAI_ETH: 'DAI_ETH',
  SHIT_ETH: 'SHIT_ETH',
  DAI_SHIT: 'DAI_SHIT'
};

// 创建上下文
const TransactionContext = createContext({
  transactions: {
    [POOL_TYPES.USDT_DAI]: [],
    [POOL_TYPES.USDT_ETH]: [],
    [POOL_TYPES.USDT_SHIT]: [],
    [POOL_TYPES.DAI_ETH]: [],
    [POOL_TYPES.SHIT_ETH]: [],
    [POOL_TYPES.DAI_SHIT]: []
  },
  addTransaction: () => {},
  getTransactions: () => [],
  clearTransactions: () => {},
  getAllTransactions: () => []
});

export function TransactionProvider({ children }) {
  // 从 localStorage 初始化状态，如果没有则使用空数组
  const loadInitialState = () => {
    try {
      const savedTransactions = localStorage.getItem('dexTransactions');
      return savedTransactions ? JSON.parse(savedTransactions) : {
        [POOL_TYPES.USDT_DAI]: [],
        [POOL_TYPES.USDT_ETH]: [],
        [POOL_TYPES.USDT_SHIT]: [],
        [POOL_TYPES.DAI_ETH]: [],
        [POOL_TYPES.SHIT_ETH]: [],
        [POOL_TYPES.DAI_SHIT]: []
      };
    } catch (error) {
      console.error('Failed to load transactions from localStorage:', error);
      return {
        [POOL_TYPES.USDT_DAI]: [],
        [POOL_TYPES.USDT_ETH]: [],
        [POOL_TYPES.USDT_SHIT]: [],
        [POOL_TYPES.DAI_ETH]: [],
        [POOL_TYPES.SHIT_ETH]: [],
        [POOL_TYPES.DAI_SHIT]: []
      };
    }
  };

  const [transactions, setTransactions] = useState(loadInitialState);

  // 当交易数据变化时，保存到 localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dexTransactions', JSON.stringify(transactions));
    } catch (error) {
      console.error('Failed to save transactions to localStorage:', error);
    }
  }, [transactions]);

  // 添加新交易到指定池子
  const addTransaction = useCallback((poolType, transaction) => {
    console.log(`Adding transaction to ${poolType}:`, transaction);
    
    setTransactions(prev => {
      // 确保 poolType 存在
      if (!prev[poolType]) {
        console.warn(`Pool type ${poolType} not found, creating new array`);
        prev[poolType] = [];
      }
      
      const newState = {
        ...prev,
        [poolType]: [transaction, ...prev[poolType]].slice(0, 100) // 保留最新的100条记录
      };
      
      // 立即保存到 localStorage
      try {
        localStorage.setItem('dexTransactions', JSON.stringify(newState));
      } catch (error) {
        console.error('Failed to save transactions to localStorage:', error);
      }
      
      return newState;
    });
  }, []);

  // 获取指定池子的所有交易
  const getTransactions = useCallback((poolType) => {
    console.log(`Getting transactions for ${poolType}:`, transactions[poolType]);
    return transactions[poolType] || [];
  }, [transactions]);

  // 获取所有池子的所有交易
  const getAllTransactions = useCallback(() => {
    const allTxs = Object.values(transactions).flat();
    console.log("Getting all transactions:", allTxs.length);
    return allTxs;
  }, [transactions]);

  // 清除指定池子的交易记录
  const clearTransactions = useCallback((poolType) => {
    setTransactions(prev => {
      let newState;
      
      if (poolType) {
        newState = {
          ...prev,
          [poolType]: []
        };
      } else {
        newState = {
          [POOL_TYPES.USDT_DAI]: [],
          [POOL_TYPES.USDT_ETH]: [],
          [POOL_TYPES.USDT_SHIT]: [],
          [POOL_TYPES.DAI_ETH]: [],
          [POOL_TYPES.SHIT_ETH]: [],
          [POOL_TYPES.DAI_SHIT]: []
        };
      }
      
      // 立即保存到 localStorage
      localStorage.setItem('dexTransactions', JSON.stringify(newState));
      return newState;
    });
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        getTransactions,
        clearTransactions,
        getAllTransactions
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

// 创建自定义Hook以便在组件中使用
export function useTransactions() {
  return useContext(TransactionContext);
}

// 辅助函数：根据合约地址确定池子类型
export function getPoolTypeByAddress(address, contracts) {
  if (!contracts || !address) return null;
  
  if (address === contracts.usdtDaiPool?.target) return POOL_TYPES.USDT_DAI;
  if (address === contracts.usdtEthPool?.target) return POOL_TYPES.USDT_ETH;
  if (address === contracts.usdtShitPool?.target) return POOL_TYPES.USDT_SHIT;
  if (address === contracts.daiEthPool?.target) return POOL_TYPES.DAI_ETH;
  if (address === contracts.shitEthPool?.target) return POOL_TYPES.SHIT_ETH;
  if (address === contracts.daiShitPool?.target) return POOL_TYPES.DAI_SHIT;
  
  return null;
}

// 辅助函数：获取池子名称
export function getPoolName(poolType) {
  switch (poolType) {
    case POOL_TYPES.USDT_DAI: return 'USDT/DAI';
    case POOL_TYPES.USDT_ETH: return 'USDT/ETH';
    case POOL_TYPES.USDT_SHIT: return 'USDT/SHIT';
    case POOL_TYPES.DAI_ETH: return 'DAI/ETH';
    case POOL_TYPES.SHIT_ETH: return 'SHIT/ETH';
    case POOL_TYPES.DAI_SHIT: return 'DAI/SHIT';
    default: return 'Unknown Pool';
  }
}