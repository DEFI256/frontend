import React, { useState, useEffect, useCallback } from 'react';
import { Select, InputNumber, Button, message, Card, Row, Col, Divider, Typography } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { ethers } from 'ethers';
import styled from 'styled-components';
import { useWallet } from '../contexts/WalletContext';

const { Option } = Select;
const { Title, Text } = Typography;

const StyledCard = styled(Card)`
  max-width: 500px;
  margin: 40px auto;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const TokenInputContainer = styled.div`
  padding: 16px;
  border-radius: 12px;
  background-color: #f8f9fa;
  margin-bottom: 16px;
`;

const StyledInputNumber = styled(InputNumber)`
  width: 100%;
  font-size: 18px;
  .ant-input-number-input {
    text-align: left;
  }
`;

const SwapButton = styled(Button)`
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 12px;
`;

const TokenSelect = styled(Select)`
  width: 100%;
  .ant-select-selector {
    height: 40px !important;
    border-radius: 8px !important;
  }
`;

function SwapPage() {
  // 从 WalletContext 获取所有合约实例
  const { contracts } = useWallet();

  // 代币选择
  const [tokenIn, setTokenIn] = useState('');
  const [tokenOut, setTokenOut] = useState('');
  const [amountIn, setAmountIn] = useState(0);

  // 兑换结果等信息
  const [exchangeRate, setExchangeRate] = useState(0);
  const [isAToB, setIsAToB] = useState(true);
  const [loading, setLoading] = useState(false);

  // 动态获取可用的代币列表
  const tokens = [
    { name: 'ETH', address: contracts.eth?.target, icon: 'Ξ' },
    { name: 'SHIT', address: contracts.shit?.target, icon: '💩' },
    { name: 'USDT', address: contracts.usdt?.target, icon: '$' },
    { name: 'DAI', address: contracts.dai?.target, icon: '◈' },
  ];

  // 根据代币选择确定 isAToB 值
  const determineIsAToB = useCallback((inToken, outToken) => {
    if (!contracts) return true;
    
    // 第一个是 USDT 时，isAToB 为 true
    if (inToken === contracts.usdt?.target) {
      return true;
    }
    
    // 第一个是 DAI，第二个是 SHIT 或 ETH 时，isAToB 为 true
    if (inToken === contracts.dai?.target && 
        (outToken === contracts.shit?.target || outToken === contracts.eth?.target)) {
      return true;
    }
    
    // 第一个是 SHIT，第二个是 ETH 时，isAToB 为 true
    if (inToken === contracts.shit?.target && outToken === contracts.eth?.target) {
      return true;
    }
    
    // 其余情况都是 false
    return false;
  }, [contracts]);

  // 监听代币选择变化，更新 isAToB
  useEffect(() => {
    if (tokenIn && tokenOut && tokenIn !== tokenOut) {
      setIsAToB(determineIsAToB(tokenIn, tokenOut));
    }
  }, [tokenIn, tokenOut, determineIsAToB]);

  // 交换代币的处理函数
  const handleSwapTokens = () => {
    // 先交换代币
    const tempTokenIn = tokenIn;
    const tempTokenOut = tokenOut;
    setTokenIn(tempTokenOut);
    setTokenOut(tempTokenIn);
    
    // 根据交换后的代币确定新的 isAToB 值
    setIsAToB(determineIsAToB(tempTokenOut, tempTokenIn));
  };

  // 设置输入代币的处理函数
  const handleTokenInChange = (value) => {
    setTokenIn(value);
    if (tokenOut && value !== tokenOut) {
      setIsAToB(determineIsAToB(value, tokenOut));
    }
  };

  // 设置输出代币的处理函数
  const handleTokenOutChange = (value) => {
    setTokenOut(value);
    if (tokenIn && value !== tokenIn) {
      setIsAToB(determineIsAToB(tokenIn, value));
    }
  };

  // 根据用户选择，确定要调用的池子合约
  const getPoolContract = useCallback(() => {
    if (!contracts.usdt || !contracts.dai || !contracts.shit || !contracts.eth) return null;
    if (
      (tokenIn === contracts.usdt.target && tokenOut === contracts.dai.target) ||
      (tokenIn === contracts.dai.target && tokenOut === contracts.usdt.target)
    ) {
      return contracts.usdtDaiPool;
    }
    if (
      (tokenIn === contracts.usdt.target && tokenOut === contracts.eth.target) ||
      (tokenIn === contracts.eth.target && tokenOut === contracts.usdt.target)
    ) {
      return contracts.usdtEthPool;
    }
    if (
      (tokenIn === contracts.usdt.target && tokenOut === contracts.shit.target) ||
      (tokenIn === contracts.shit.target && tokenOut === contracts.usdt.target)
    ) {
      return contracts.usdtShitPool;
    }
    if (
      (tokenIn === contracts.dai.target && tokenOut === contracts.eth.target) ||
      (tokenIn === contracts.eth.target && tokenOut === contracts.dai.target)
    ) {
      return contracts.daiEthPool;
    }
    if (
      (tokenIn === contracts.shit.target && tokenOut === contracts.eth.target) ||
      (tokenIn === contracts.eth.target && tokenOut === contracts.shit.target)
    ) {
      return contracts.shitEthPool;
    }
    if (
      (tokenIn === contracts.dai.target && tokenOut === contracts.shit.target) ||
      (tokenIn === contracts.shit.target && tokenOut === contracts.dai.target)
    ) {
      return contracts.daiShitPool;
    }
    return null;
  }, [contracts, tokenIn, tokenOut]);

  // 获取交易详情
  const fetchSwapDetails = useCallback(async () => {
    if (!tokenIn || !tokenOut || amountIn <= 0) return;
    const poolContract = getPoolContract();
    if (!poolContract) {
      message.error('No pool contract found for the selected tokens.');
      return;
    }
    try {
      const amountInWei = ethers.parseUnits(amountIn.toString(), 18);
      const pairedAmount = await poolContract.getPairedAmount(amountInWei, isAToB);
      setExchangeRate(parseFloat(ethers.formatUnits(pairedAmount, 18)) / amountIn);
    } catch (error) {
      console.error('Failed to fetch swap details:', error);
      message.error('Failed to fetch swap details.');
    }
  }, [amountIn, tokenIn, tokenOut, isAToB, getPoolContract]);

  useEffect(() => {
    fetchSwapDetails();
  }, [fetchSwapDetails]);

  // 输入兑换数量
  const handleAmountInChange = (value) => {
    setAmountIn(value || 0);
  };

  // 获取输入代币的合约
  const getTokenInContract = () => {
    if (tokenIn === contracts.usdt?.target) return contracts.usdt;
    if (tokenIn === contracts.dai?.target) return contracts.dai;
    if (tokenIn === contracts.shit?.target) return contracts.shit;
    if (tokenIn === contracts.eth?.target) return contracts.eth;
    return null;
  };

  // 获取代币名称
  const getTokenName = (address) => {
    return tokens.find(t => t.address === address)?.name || 'Unknown';
  };

  const handleSwap = async () => {
    if (!tokenIn || !tokenOut || amountIn <= 0) {
      message.error('Please select tokens and enter a valid amount.');
      return;
    }

    const poolContract = getPoolContract();
    if (!poolContract) {
      message.error('No pool contract found for the selected tokens.');
      return;
    }

    setLoading(true);
    
    try {
      const amountInWei = ethers.parseUnits(amountIn.toString(), 18);
      const minAmountOut = ethers.parseUnits((amountIn * exchangeRate * 0.95).toString(), 18); // 5% 滑点保护
      
      const tokenContract = getTokenInContract();
      if (!tokenContract) {
        message.error('Token contract not found');
        setLoading(false);
        return;
      }
      
      // 执行授权
      const tokenName = getTokenName(tokenIn);
      message.loading(`Approving ${tokenName} transfer...`, 0);
      
      try {
        console.log(tokenContract, poolContract, amountInWei);
        const approveTx = await tokenContract.approve(poolContract.target, amountInWei);
        await approveTx.wait();
        message.destroy();
        message.success(`${tokenName} approved!`);
      } catch (error) {
        message.destroy();
        message.error(`Failed to approve ${tokenName}: ${error.message}`);
        setLoading(false);
        return;
      }

      // 执行交换
      message.loading('Processing swap transaction...', 0);
      console.log(amountInWei, isAToB, minAmountOut);
      const swapTx = await poolContract.swap(amountInWei, isAToB, minAmountOut);
      await swapTx.wait();
      
      message.destroy();
      message.success('Swap successful!');
      
      // 刷新交换详情
      fetchSwapDetails();
      
    } catch (error) {
      console.error('Swap failed:', error);
      message.destroy();
      message.error(`Swap failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledCard>
      <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
        Swap Tokens
      </Title>

      <TokenInputContainer>
        <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
          <Text type="secondary">From</Text>
        </Row>
        <Row gutter={8} align="middle">
          <Col span={14}>
            <StyledInputNumber
              min={0}
              value={amountIn}
              onChange={handleAmountInChange}
              size="large"
              placeholder="0.0"
              style={{ width: '100%' }}
              disabled={loading}
            />
          </Col>
          <Col span={10}>
            <TokenSelect
              size="large"
              onChange={handleTokenInChange}
              placeholder="Select token"
              value={tokenIn}
              disabled={loading}
            >
              {tokens.map((token) => (
                <Option key={token.name} value={token.address}>
                  <Row align="middle">
                    <span style={{ marginRight: 8 }}>{token.icon}</span>
                    {token.name}
                  </Row>
                </Option>
              ))}
            </TokenSelect>
          </Col>
        </Row>
      </TokenInputContainer>

      <div style={{ textAlign: 'center', margin: '-10px 0' }}>
        <Button
          type="text"
          shape="circle"
          icon={<SwapOutlined style={{ fontSize: 20 }} />}
          onClick={handleSwapTokens}
          disabled={loading}
        />
      </div>

      <TokenInputContainer>
        <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
          <Text type="secondary">To</Text>
        </Row>
        <Row gutter={8} align="middle">
          <Col span={14}>
            <StyledInputNumber
              min={0}
              value={exchangeRate > 0 ? (amountIn * exchangeRate).toFixed(6) : 0}
              size="large"
              placeholder="0.0"
              disabled
            />
          </Col>
          <Col span={10}>
            <TokenSelect
              size="large"
              onChange={handleTokenOutChange}
              placeholder="Select token"
              value={tokenOut}
              disabled={loading}
            >
              {tokens.map((token) => (
                <Option key={token.name} value={token.address}>
                  <Row align="middle">
                    <span style={{ marginRight: 8 }}>{token.icon}</span>
                    {token.name}
                  </Row>
                </Option>
              ))}
            </TokenSelect>
          </Col>
        </Row>
      </TokenInputContainer>

      <Divider />

      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Text type="secondary">Exchange Rate</Text>
        <Text>
          {exchangeRate
            ? `1 ${getTokenName(tokenIn)} = ${exchangeRate.toFixed(6)} ${getTokenName(tokenOut)}`
            : 'Calculating...'}
        </Text>
      </Row>

      <SwapButton
        type="primary"
        size="large"
        loading={loading}
        disabled={!tokenIn || !tokenOut || amountIn <= 0 || tokenIn === tokenOut || loading}
        onClick={handleSwap}
      >
        {tokenIn && tokenOut
          ? `Swap ${getTokenName(tokenIn)} to ${getTokenName(tokenOut)}`
          : 'Select Tokens'}
      </SwapButton>
    </StyledCard>
  );
}

export default SwapPage;