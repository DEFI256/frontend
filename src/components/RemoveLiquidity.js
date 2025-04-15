import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Button, Select, Input, message, Card, Row, Typography, Divider } from 'antd';
import { MinusOutlined } from '@ant-design/icons';
import { ethers } from 'ethers';
import styled from 'styled-components';
import { useWallet } from '../contexts/WalletContext';


const { Content } = Layout;
const { Option } = Select;
const { Text } = Typography;

const StyledInput = styled(Input)`
  border-radius: 8px;
`;

const StyledCard = styled(Card)`
  max-width: 600px;
  margin: 40px auto;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

function RemoveLiquidity() {
  const { contracts, signer, walletAddress, tokenBalances, fetchTokenBalances } = useWallet();

  const [tokenA, setTokenA] = useState('');
  const [tokenB, setTokenB] = useState('');
  const [lpAmount, setLpAmount] = useState('');
  const [estimatedA, setEstimatedA] = useState('0');
  const [estimatedB, setEstimatedB] = useState('0');
  const [lpBalance, setLpBalance] = useState('0');
  const [loading, setLoading] = useState(false);
  const [isTokenSelected, setIsTokenSelected] = useState(false);

  const supportedTokens = [
    { name: 'ETH', address: contracts?.eth?.target, icon: 'Ξ' },
    { name: 'SHIT', address: contracts?.shit?.target, icon: '💩' },
    { name: 'USDT', address: contracts?.usdt?.target, icon: '$' },
    { name: 'DAI', address: contracts?.dai?.target, icon: '◈' },
  ].filter(token => token.address);

  const getPoolContract = useCallback(() => {
    if (!contracts?.usdt || !contracts?.dai || !contracts?.shit || !contracts?.eth) return null;

    const poolMapping = {
      [`${contracts.usdt.target}-${contracts.dai.target}`]: contracts.usdtDaiPool,
      [`${contracts.dai.target}-${contracts.usdt.target}`]: contracts.usdtDaiPool,
      [`${contracts.usdt.target}-${contracts.eth.target}`]: contracts.usdtEthPool,
      [`${contracts.eth.target}-${contracts.usdt.target}`]: contracts.usdtEthPool,
      [`${contracts.usdt.target}-${contracts.shit.target}`]: contracts.usdtShitPool,
      [`${contracts.shit.target}-${contracts.usdt.target}`]: contracts.usdtShitPool,
      [`${contracts.dai.target}-${contracts.eth.target}`]: contracts.daiEthPool,
      [`${contracts.eth.target}-${contracts.dai.target}`]: contracts.daiEthPool,
      [`${contracts.shit.target}-${contracts.eth.target}`]: contracts.shitEthPool,
      [`${contracts.eth.target}-${contracts.shit.target}`]: contracts.shitEthPool,
      [`${contracts.dai.target}-${contracts.shit.target}`]: contracts.daiShitPool,
      [`${contracts.shit.target}-${contracts.dai.target}`]: contracts.daiShitPool,
    };

    const key = `${tokenA}-${tokenB}`;
    const pool = poolMapping[key];
    if (!pool) {
      console.error(`未找到池子: ${key}`);
      message.error('未找到对应池子合约');
    }
    return pool;
  }, [contracts, tokenA, tokenB]);

  const getLpTokenContract = useCallback(() => {
    if (!contracts) return null;

    const lpMapping = {
      [`${contracts.usdt.target}-${contracts.dai.target}`]: contracts.usdtDaiLp,
      [`${contracts.dai.target}-${contracts.usdt.target}`]: contracts.usdtDaiLp,
      [`${contracts.usdt.target}-${contracts.eth.target}`]: contracts.usdtEthLp,
      [`${contracts.eth.target}-${contracts.usdt.target}`]: contracts.usdtEthLp,
      [`${contracts.usdt.target}-${contracts.shit.target}`]: contracts.usdtShitLp,
      [`${contracts.shit.target}-${contracts.usdt.target}`]: contracts.usdtShitLp,
      [`${contracts.dai.target}-${contracts.eth.target}`]: contracts.daiEthLp,
      [`${contracts.eth.target}-${contracts.dai.target}`]: contracts.daiEthLp,
      [`${contracts.shit.target}-${contracts.eth.target}`]: contracts.shitEthLp,
      [`${contracts.eth.target}-${contracts.shit.target}`]: contracts.shitEthLp,
      [`${contracts.dai.target}-${contracts.shit.target}`]: contracts.daiShitLp,
      [`${contracts.shit.target}-${contracts.dai.target}`]: contracts.daiShitLp,
    };

    const key = `${tokenA}-${tokenB}`;
    const lpToken = lpMapping[key];
    if (!lpToken) {
      console.error(`未找到 LP 代币合约: ${key}`);
    }
    return lpToken;
  }, [contracts, tokenA, tokenB]);

  const fetchLpBalance = useCallback(async () => {
    const poolContract = getPoolContract();
    const lpTokenContract = getLpTokenContract();
    if (!poolContract || !lpTokenContract || !signer || !walletAddress) {
      console.error('缺少必要组件', { poolContract, lpTokenContract, signer, walletAddress });
      setLpBalance('0');
      return;
    }

    const maxRetries = 10;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const lpTokenAddress = await poolContract.lpToken();
        console.log(`尝试 ${attempt + 1} - 池子返回的 LP 代币地址: ${lpTokenAddress}`);
        console.log(`尝试 ${attempt + 1} - 预期 LP 代币地址: ${lpTokenContract.target}`);
        console.log(`尝试 ${attempt + 1} - 查询余额的钱包地址: ${walletAddress}`);

        if (lpTokenAddress.toLowerCase() !== lpTokenContract.target.toLowerCase()) {
          console.warn('LP 代币地址不匹配，请检查 contractAddeess.js 配置');
          message.warning('LP 代币地址可能配置错误，请联系管理员');
        }

        const balance = await lpTokenContract.balanceOf(walletAddress);
        const formattedBalance = ethers.formatUnits(balance, 18);
        console.log(`尝试 ${attempt + 1} - LP Token Balance: ${formattedBalance}`);
        setLpBalance(formattedBalance);
        return;
      } catch (error) {
        console.error(`尝试 ${attempt + 1} 获取 LP 余额失败:`, error);
        attempt++;
        if (attempt === maxRetries) {
          message.error('获取 LP 代币余额失败，请检查网络或合约配置');
          setLpBalance('0');
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }, [getPoolContract, getLpTokenContract, signer, walletAddress]);

  const estimateReturns = useCallback(async (amount) => {
    const poolContract = getPoolContract();
    
    // 输入校验（确保是有效数字）
    if (
      !poolContract ||
      !amount.trim() ||
      isNaN(parseFloat(amount)) ||
      parseFloat(amount) <= 0
    ) {
      setEstimatedA('0');
      setEstimatedB('0');
      return;
    }
  
    try {
        const decimals = 18; // LP 代币小数位数
        const lpAmountWei = ethers.parseUnits(amount.toString(), decimals); // bigint
    
        const [reserveA, reserveB, totalLiquidity] = await poolContract.getReservesAndLiquidity();
        if (totalLiquidity === 0n) return; // bigint 零值判断
    
        // 直接使用 bigint 运算（无需 BigInt 构造函数）
        const amountA = (lpAmountWei * reserveA) / totalLiquidity;
        const amountB = (lpAmountWei * reserveB) / totalLiquidity;
    
        // ✅ 关键：使用 ethers.formatUnits 直接格式化 bigint
        const tokenADecimals = 18; // 代币 A 的实际小数位数（如从合约获取）
        const tokenBDecimals = 18; // 代币 B 的实际小数位数
        setEstimatedA(ethers.formatUnits(amountA, tokenADecimals)); // 自动处理精度
        setEstimatedB(ethers.formatUnits(amountB, tokenBDecimals));
    } catch (error) {
      console.error('预估返还金额失败:', error);
      setEstimatedA('0');
      setEstimatedB('0');
    }
  }, [getPoolContract]);

  useEffect(() => {
    console.log('[DEBUG] useEffect 触发，isTokenSelected:', isTokenSelected); // 添加这行
    if (isTokenSelected) {
      const key = `${tokenA}-${tokenB}`;
      console.log('[DEBUG] 当前 token 对:', key); // 添加这行
      const lpKeys = {
        [`${contracts?.usdt?.target}-${contracts?.dai?.target}`]: 'usdtDaiLp',
        [`${contracts?.dai?.target}-${contracts?.usdt?.target}`]: 'usdtDaiLp',
        [`${contracts?.usdt?.target}-${contracts?.eth?.target}`]: 'usdtEthLp',
        [`${contracts?.eth?.target}-${contracts?.usdt?.target}`]: 'usdtEthLp',
        [`${contracts?.usdt?.target}-${contracts?.shit?.target}`]: 'usdtShitLp',
        [`${contracts?.shit?.target}-${contracts?.usdt?.target}`]: 'usdtShitLp',
        [`${contracts?.dai?.target}-${contracts?.eth?.target}`]: 'daiEthLp',
        [`${contracts?.eth?.target}-${contracts?.dai?.target}`]: 'daiEthLp',
        [`${contracts?.shit?.target}-${contracts?.eth?.target}`]: 'shitEthLp',
        [`${contracts?.eth?.target}-${contracts?.shit?.target}`]: 'shitEthLp',
        [`${contracts?.dai?.target}-${contracts?.shit?.target}`]: 'daiShitLp',
        [`${contracts?.shit?.target}-${contracts?.dai?.target}`]: 'daiShitLp',
      };
      const lpKey = lpKeys[key];
      if (lpKey && tokenBalances[lpKey]) {
        setLpBalance(tokenBalances[lpKey].amount);
      } else {
        fetchLpBalance();
      }
    }
  }, [isTokenSelected, tokenA, tokenB, tokenBalances, fetchLpBalance, contracts]);

  const handleRemoveLiquidity = async () => {
    if (!lpAmount || parseFloat(lpAmount) <= 0 || parseFloat(lpAmount) > parseFloat(lpBalance)) {
      message.error('请输入有效的 LP 代币数量');
      return;
    }

    const poolContract = getPoolContract();
    const lpTokenContract = getLpTokenContract();
    if (!poolContract || !lpTokenContract) {
      message.error('未找到对应池子或 LP 代币合约');
      return;
    }

    setLoading(true);
    try {
      const lpAmountWei = ethers.parseUnits(lpAmount.toString(), 18);
      const minAmountA = ethers.parseUnits((parseFloat(estimatedA) * 0.99).toString(), 18);
      const minAmountB = ethers.parseUnits((parseFloat(estimatedB) * 0.99).toString(), 18);

      message.loading('Approval of LP tokens is in progress...', 0);
      try {
        const approveTx = await lpTokenContract.approve(poolContract.target, lpAmountWei);
        await approveTx.wait();
        message.destroy();
        message.success('LP Tokens Approved!');
      } catch (error) {
        message.destroy();
        message.error(`Approval of LP tokens failed: ${error.message}`);
        setLoading(false);
        return;
      }

      message.loading('Removing liquidity...', 0);
      const tx = await poolContract.removeLiquidity(lpAmountWei, minAmountA, minAmountB);
      await tx.wait();
      message.destroy();
      message.success('Liquidity removal successful！');

      await fetchTokenBalances();
      setLpAmount('');
      setEstimatedA('0');
      setEstimatedB('0');
      await fetchLpBalance();
    } catch (error) {
      console.error('Failed to remove liquidity:', error);
      message.destroy();
      message.error(`Failed to remove liquidity: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!tokenA || !tokenB || tokenA === tokenB) {
      message.error('Please select a different token');
      return;
    }
    setIsTokenSelected(true);
  };

  const handleTokenAChange = (value) => {
    if (!isTokenSelected) {
      setTokenA(value);
    }
  };

  const handleTokenBChange = (value) => {
    if (!isTokenSelected) {
      setTokenB(value);
    }
  };

  const handleBack = () => {
    setTokenA('');
    setTokenB('');
    setLpAmount('');
    setEstimatedA('0');
    setEstimatedB('0');
    setLpBalance('0');
    setIsTokenSelected(false);
  };

  const handleLpAmountChange = (e) => {
    const value = e.target.value;
    console.log('[DEBUG] 输入的 LP 数量:', value); // 添加这行
    setLpAmount(value);
    estimateReturns(value);
  };

  const handleMax = () => {
    setLpAmount(lpBalance);
    estimateReturns(lpBalance);
  };

  return (
    <Layout style={{ background: '#f5f7fa', minHeight: '100vh' }}>
      <Content style={{ padding: '24px' }}>
        <StyledCard title={<Text strong>Removing Liquidity</Text>}>
          {!isTokenSelected ? (
            <>
              <div style={{ marginBottom: '24px' }}>
                <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>Token A</Text>
                <Select
                  value={tokenA}
                  onChange={handleTokenAChange}
                  placeholder="choose"
                  disabled={supportedTokens.length === 0}
                  size="large"
                  style={{ width: '100%', borderRadius: '8px' }}
                >
                  {supportedTokens.map((token) => (
                    <Option key={token.address} value={token.address}>
                      <Row align="middle">
                        <span style={{ marginRight: 8 }}>{token.icon}</span>
                        {token.name}
                      </Row>
                    </Option>
                  ))}
                </Select>
              </div>

              <div style={{ textAlign: 'center', margin: '16px 0' }}>
                <MinusOutlined style={{ fontSize: '20px', color: '#666' }} />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>Token B</Text>
                <Select
                  value={tokenB}
                  onChange={handleTokenBChange}
                  placeholder="choose"
                  disabled={supportedTokens.length === 0}
                  size="large"
                  style={{ width: '100%', borderRadius: '8px' }}
                >
                  {supportedTokens.filter(token => token.address !== tokenA).map((token) => (
                    <Option key={token.address} value={token.address}>
                      <Row align="middle">
                        <span style={{ marginRight: 8 }}>{token.icon}</span>
                        {token.name}
                      </Row>
                    </Option>
                  ))}
                </Select>
              </div>

              <Button
                type="primary"
                block
                size="large"
                onClick={handleContinue}
                disabled={!tokenA || !tokenB || tokenA === tokenB}
                style={{ borderRadius: '8px', height: '48px' }}
              >
                continue
              </Button>
            </>
          ) : (
            <>
              <div style={{ marginBottom: '24px' }}>
                <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                LP Token Number
                  <Button
                    type="link"
                    onClick={handleMax}
                    style={{ padding: 0, marginLeft: 8 }}
                    disabled={parseFloat(lpBalance) === 0}
                  >
                    maximum
                  </Button>
                </Text>
                <StyledInput
                  placeholder="0.0"
                  value={lpAmount}
                  onChange={handleLpAmountChange}
                  type="number"
                  size="large"
                />
              </div>

              <Divider />

              <div style={{ marginBottom: '24px' }}>
                <Row justify="space-between" style={{ marginBottom: '8px' }}>
                  <Text type="secondary">Your LP token balance</Text>
                  <Text>{lpBalance} LP</Text>
                </Row>
                <Row justify="space-between" style={{ marginBottom: '8px' }}>
                  <Text type="secondary">Expected to receive {supportedTokens.find((t) => t.address === tokenA)?.name}</Text>
                  <Text>{estimatedA}</Text>
                </Row>
                <Row justify="space-between">
                  <Text type="secondary">Expected to receive {supportedTokens.find((t) => t.address === tokenB)?.name}</Text>
                  <Text>{estimatedB}</Text>
                </Row>
              </div>

              <Button
                type="primary"
                block
                size="large"
                loading={loading}
                onClick={handleRemoveLiquidity}
                disabled={!lpAmount || parseFloat(lpAmount) <= 0 || parseFloat(lpAmount) > parseFloat(lpBalance)}
                style={{
                  borderRadius: '8px',
                  height: '48px',
                  marginBottom: '16px',
                  background: 'linear-gradient(135deg, #ff4d4f, #d9363e)',
                  border: 'none'
                }}
              >
                Removing Liquidity
              </Button>

              <Button
                block
                size="large"
                onClick={handleBack}
                style={{ borderRadius: '8px', height: '48px' }}
              >
                Back
              </Button>
            </>
          )}
        </StyledCard>
      </Content>
    </Layout>
  );
}

export default RemoveLiquidity;