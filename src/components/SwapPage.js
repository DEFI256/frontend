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
  // 注意：每个合约对象都包含其本身的 address 属性
  const { contracts } = useWallet();

  // 代币选择
  const [tokenIn, setTokenIn] = useState('');
  const [tokenOut, setTokenOut] = useState('');
  const [amountIn, setAmountIn] = useState(0);

  // 兑换结果等信息
  const [exchangeRate, setExchangeRate] = useState(0);
  const [isAToB, setIsAToB] = useState(true);

  // 动态获取可用的代币列表
  // 这里通过  contracts.<代币合约>.address 获取代币地址，而不是从文件中导入
  const tokens = [
    { name: 'ETH',  address: contracts.eth?.target,  icon: 'Ξ' },
    { name: 'SHIT', address: contracts.shit?.target, icon: '💩' },
    { name: 'USDT', address: contracts.usdt?.target, icon: '$' },
    { name: 'DAI',  address: contracts.dai?.target,  icon: '◈' },
  ];

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

  // 将 getPoolContract 放进 useCallback 的依赖
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

  // 交换代币
  const handleSwapTokens = () => {
    setTokenIn(tokenOut);
    setTokenOut(tokenIn);
    setIsAToB(!isAToB);
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
            />
          </Col>
          <Col span={10}>
            <TokenSelect
              size="large"
              onChange={setTokenIn}
              placeholder="Select token"
              value={tokenIn}
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
              onChange={setTokenOut}
              placeholder="Select token"
              value={tokenOut}
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
            ? `1 ${
                tokens.find((t) => t.address === tokenIn)?.name
              } = ${exchangeRate.toFixed(6)} ${
                tokens.find((t) => t.address === tokenOut)?.name
              }`
            : 'Calculating...'}
        </Text>
      </Row>

      <SwapButton
        type="primary"
        size="large"
        disabled={!tokenIn || !tokenOut || amountIn <= 0 || tokenIn === tokenOut}
      >
        {tokenIn && tokenOut
          ? `Swap ${
              tokens.find((t) => t.address === tokenIn)?.name
            } to ${tokens.find((t) => t.address === tokenOut)?.name}`
          : 'Select Tokens'}
      </SwapButton>
    </StyledCard>
  );
}

export default SwapPage;