import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { message } from 'antd';
import {
  usdtAddress,
  daiAddress,
  shitAddress,
  ethAddress,
  usdtDaiLpTokenAddress,
  usdtEthLpTokenAddress,
  usdtShitLpTokenAddress,
  daiEthLpTokenAddress,
  shitEthLpTokenAddress,
  daiShitLpTokenAddress,
  usdtDaiPoolAddress,
  usdtEthPoolAddress,
  usdtShitPoolAddress,
  daiEthPoolAddress,
  shitEthPoolAddress,
  daiShitPoolAddress
} from '../abis/contractAddeess';
import { stablePoolAbi } from '../abis/StableSwapPool';
import { nonStablePoolAbi } from '../abis/NonStableSwapPool';
import { lpTokenAbi } from '../abis/LPToken';
import { tokenAbi } from '../abis/Token';
import axios from 'axios';

const fetchTokenPrices = async () => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,tether,dai,doge&vs_currencies=usd'
    );
    return {
      eth: response.data.ethereum.usd,
      usdt: response.data.tether.usd,
      dai: response.data.dai.usd,
      shit: response.data.doge.usd, // 如果 SHIT 没有价格，可以手动设置为 0 或其他值
    };
  } catch (error) {
    console.error('获取代币价格失败:', error);
    return { eth: 0, usdt: 0, dai: 0, shit: 0 };
  }
};

const tokens = [
  { name: 'ETH', address: '0xETH...', icon: 'Ξ', decimals: 18 },
  { name: 'SHIT', address: '0xSHIT...', icon: '💩', decimals: 18 },
  { name: 'USDC', address: '0xUSDC...', icon: '$', decimals: 6 },
  { name: 'DAI', address: '0xDAI...', icon: '◈', decimals: 18 },
];

// 创建上下文，增加所有合约的初始值
const WalletContext = createContext({
  walletAddress: '',
  isConnected: false,
  provider: null,
  signer: null,
  loading: true,
  connectWallet: () => { },
  disconnectWallet: () => { },
  formatAddress: () => { },
  // 添加所有合约的初始值
  contracts: {
    // 代币合约
    usdt: null,
    dai: null,
    shit: null,
    eth: null,
    // LP代币合约
    usdtDaiLp: null,
    usdtEthLp: null,
    usdtShitLp: null,
    daiEthLp: null,
    shitEthLp: null,
    daiShitLp: null,
    // 池合约
    usdtDaiPool: null,
    usdtEthPool: null,
    usdtShitPool: null,
    daiEthPool: null,
    shitEthPool: null,
    daiShitPool: null,
  }
});

export function WalletProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [loading, setLoading] = useState(true);

  // 创建一个状态来存储所有合约
  const [contracts, setContracts] = useState({
    // 代币合约
    usdt: null,
    dai: null,
    shit: null,
    eth: null,
    // LP代币合约
    usdtDaiLp: null,
    usdtEthLp: null,
    usdtShitLp: null,
    daiEthLp: null,
    shitEthLp: null,
    daiShitLp: null,
    // 池合约
    usdtDaiPool: null,
    usdtEthPool: null,
    usdtShitPool: null,
    daiEthPool: null,
    shitEthPool: null,
    daiShitPool: null,
  });

  // 创建一个状态来存储代币余额
  const [tokenBalances, setTokenBalances] = useState({
    usdt: '0',
    dai: '0',
    shit: '0',
    eth: '0',
  });

  // 获取代币余额的函数
  const fetchTokenBalances = useCallback(async () => {
    if (!walletAddress || !contracts) return;
  
    try {
      const balances = {};
      const prices = await fetchTokenPrices();
  
      // 获取 USDT 余额
      if (contracts.usdt) {
        const usdtBalance = await contracts.usdt.balanceOf(walletAddress);
        console.log(222, usdtBalance);
        const formattedAmount = parseFloat(ethers.formatUnits(usdtBalance, 18)).toFixed(2);
        balances.usdt = {
          amount: formattedAmount,
          usd: (parseFloat(formattedAmount) * prices.usdt).toFixed(2),
        };
      }
  
      // 获取 DAI 余额
      if (contracts.dai) {
        const daiBalance = await contracts.dai.balanceOf(walletAddress);
        const formattedAmount = parseFloat(ethers.formatUnits(daiBalance, 18)).toFixed(2);
        balances.dai = {
          amount: formattedAmount,
          usd: (parseFloat(formattedAmount) * prices.dai).toFixed(2),
        };
      }
  
      // 获取 SHIT 余额
      if (contracts.shit) {
        const shitBalance = await contracts.shit.balanceOf(walletAddress);
        const formattedAmount = parseFloat(ethers.formatUnits(shitBalance, 18)).toFixed(2);
        balances.shit = {
          amount: formattedAmount,
          usd: (parseFloat(formattedAmount) * prices.shit).toFixed(2),
        };
      }
  
      // 获取 ETH 余额
      if (contracts.eth) {
        const ethBalance = await contracts.eth.balanceOf(walletAddress);
        const formattedAmount = parseFloat(ethers.formatUnits(ethBalance, 18)).toFixed(2);
        balances.eth = {
          amount: formattedAmount,
          usd: (parseFloat(formattedAmount) * prices.eth).toFixed(2),
        };
      }
  
      setTokenBalances(balances);
    } catch (error) {
      console.error('获取代币余额失败:', error);
    }
  }, [walletAddress, contracts]);

  // 处理账户变化
  const handleAccountsChanged = useCallback((accounts) => {
    if (accounts.length === 0) {
      // 用户断开了连接
      setWalletAddress('');
      setIsConnected(false);
      // 清空所有合约
      setContracts({
        // 代币合约
        usdt: null,
        dai: null,
        shit: null,
        eth: null,
        // LP代币合约
        usdtDaiLp: null,
        usdtEthLp: null,
        usdtShitLp: null,
        daiEthLp: null,
        shitEthLp: null,
        daiShitLp: null,
        // 池合约
        usdtDaiPool: null,
        usdtEthPool: null,
        usdtShitPool: null,
        daiEthPool: null,
        shitEthPool: null,
        daiShitPool: null,
      });
      message.info('钱包已断开连接');
    } else {
      // 用户切换了账户
      setWalletAddress(accounts[0]);
      message.info('钱包账户已切换');
    }
  }, []);

  // 使用 useCallback 重构连接钱包函数
  const connectWallet = useCallback(async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });

        if (accounts.length === 0) {
          message.error('没有获取到账户');
          return false;
        }

        const address = accounts[0];
        const signer = await provider.getSigner();

        setWalletAddress(address);
        setProvider(provider);
        setSigner(signer);
        setIsConnected(true);

        // 初始化所有合约
        try {
          const usdtDaiLpTokenContract = new ethers.Contract(usdtDaiLpTokenAddress, lpTokenAbi, signer);
          const usdtEthLpTokenContract = new ethers.Contract(usdtEthLpTokenAddress, lpTokenAbi, signer);
          const usdtShitLpTokenContract = new ethers.Contract(usdtShitLpTokenAddress, lpTokenAbi, signer);
          const daiEthLpTokenContract = new ethers.Contract(daiEthLpTokenAddress, lpTokenAbi, signer);
          const shitEthLpTokenContract = new ethers.Contract(shitEthLpTokenAddress, lpTokenAbi, signer);
          const daiShitLpTokenContract = new ethers.Contract(daiShitLpTokenAddress, lpTokenAbi, signer);
          const usdtDaiPoolContract = new ethers.Contract(usdtDaiPoolAddress, nonStablePoolAbi, signer);
          const usdtEthPoolContract = new ethers.Contract(usdtEthPoolAddress, stablePoolAbi, signer);
          const usdtShitPoolContract = new ethers.Contract(usdtShitPoolAddress, stablePoolAbi, signer);
          const daiEthPoolContract = new ethers.Contract(daiEthPoolAddress, stablePoolAbi, signer);
          const shitEthPoolContract = new ethers.Contract(shitEthPoolAddress, stablePoolAbi, signer);
          const daiShitPoolContract = new ethers.Contract(daiShitPoolAddress, stablePoolAbi, signer);
          const daiContract = new ethers.Contract(daiAddress, tokenAbi, signer);
          const usdtContract = new ethers.Contract(usdtAddress, tokenAbi, signer);
          const shitContract = new ethers.Contract(shitAddress, tokenAbi, signer);
          const ethContract = new ethers.Contract(ethAddress, tokenAbi, signer);

          // 将所有合约保存到状态中
          setContracts({
            // 代币合约
            usdt: usdtContract,
            dai: daiContract,
            shit: shitContract,
            eth: ethContract,
            // LP代币合约
            usdtDaiLp: usdtDaiLpTokenContract,
            usdtEthLp: usdtEthLpTokenContract,
            usdtShitLp: usdtShitLpTokenContract,
            daiEthLp: daiEthLpTokenContract,
            shitEthLp: shitEthLpTokenContract,
            daiShitLp: daiShitLpTokenContract,
            // 池合约
            usdtDaiPool: usdtDaiPoolContract,
            usdtEthPool: usdtEthPoolContract,
            usdtShitPool: usdtShitPoolContract,
            daiEthPool: daiEthPoolContract,
            shitEthPool: shitEthPoolContract,
            daiShitPool: daiShitPoolContract,
          });
        } catch (error) {
          console.error('合约初始化失败:', error);
          message.error('合约初始化失败: ' + error.message);
        }

        // 监听账户变化
        window.ethereum.on('accountsChanged', handleAccountsChanged);

        return true;
      } else {
        message.error('请安装 MetaMask 钱包!');
        return false;
      }
    } catch (error) {
      console.error('钱包连接失败:', error);
      message.error('钱包连接失败: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [handleAccountsChanged]); // 依赖 handleAccountsChanged

  // 断开连接
  const disconnectWallet = useCallback(() => {
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }
    setWalletAddress('');
    setIsConnected(false);
    setProvider(null);
    setSigner(null);

    // 清空所有合约
    setContracts({
      usdt: null,
      dai: null,
      shit: null,
      eth: null,
      usdtDaiLp: null,
      usdtEthLp: null,
      usdtShitLp: null,
      daiEthLp: null,
      shitEthLp: null,
      daiShitLp: null,
      usdtDaiPool: null,
      usdtEthPool: null,
      usdtShitPool: null,
      daiEthPool: null,
      shitEthPool: null,
      daiShitPool: null,
    });
  }, [handleAccountsChanged]); // 依赖 handleAccountsChanged

  // 格式化地址显示 (0xF807...2a7B)
  const formatAddress = useCallback((address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }, []);

  // 在组件挂载时检查是否已连接
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            // 用户已经连接了钱包
            await connectWallet();
          }
        } catch (error) {
          console.error('检查钱包连接状态失败:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkConnection();
  }, [connectWallet]); // 添加 connectWallet 作为依赖

  // 在钱包连接后获取代币余额
  useEffect(() => {
    if (isConnected) {
      fetchTokenBalances();
    }
  }, [isConnected, fetchTokenBalances]);

  return (
    <WalletContext.Provider
      value={{
        tokens,
        walletAddress,
        isConnected,
        provider,
        signer,
        loading,
        connectWallet,
        disconnectWallet,
        formatAddress,
        contracts, // 添加所有合约到 Context 的 value 中
        tokenBalances, // 将代币余额添加到 Context 中
        fetchTokenBalances, // 将获取余额的函数暴露出去
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

// 创建自定义Hook以便在组件中使用
export function useWallet() {
  return useContext(WalletContext);
}



