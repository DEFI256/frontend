import React, { useState, useEffect  } from 'react';
import { Select, InputNumber, Button, message, Card, Row, Col, Divider, Typography } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { ethers } from 'ethers';
import styled from 'styled-components';

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

function SwapPage({ swapContract }) {
  const [tokenIn, setTokenIn] = useState('');
  const [tokenOut, setTokenOut] = useState('');
  const [amountIn, setAmountIn] = useState(0);
  const [amountOut, setAmountOut] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0); // 存储兑换率
  const [loading, setLoading] = useState(false);

  // 假设支持10种代币，实际地址从后端获取
  const tokens = [
    { name: 'ETH', address: '0xETH...', icon: 'Ξ' },
    { name: 'SHIT', address: '0xSHIT...', icon: '💩' },
    { name: 'USDT', address: '0xUSDT...', icon: '$' },
    { name: 'DAI', address: '0xDAI...', icon: '◈' },
    { name: 'UNI', address: '0xUNI...', icon: '🦄' },
  ];

    // 模拟获取代币兑换率，实际代码中需要从合约中获取
    const getExchangeRate = (tokenIn, tokenOut) => {
      // 示例中返回1 ETH = 2000 USDT
      return 2000;
    };

  const handleAmountInChange = (value) => {
    setAmountIn(value || 0);
  };

  const getTokenName = (address) => {
    const token = tokens.find((token) => token.address === address);
    return token ? token.name : '';
  };
  

  // 动态计算输出金额
  useEffect(() => {
    if (amountIn > 0 && tokenIn && tokenOut) {
      const exchangeRate = getExchangeRate(tokenIn, tokenOut); // 获取兑换率
      setExchangeRate(exchangeRate); // 更新兑换率
      const outputAmount = amountIn * exchangeRate; // 计算输出金额
      setAmountOut(outputAmount); // 更新输出金额
    }
  }, [amountIn, tokenIn, tokenOut]);

  const handleSwap = async () => {
    if (!tokenIn || !tokenOut || amountIn <= 0) {
      message.error('Please fill in all fields');
      return;
    }
    if (tokenIn === tokenOut) {
      message.error('Token In and Token Out cannot be the same');
      return;
    }

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      const tx = await swapContract.connect(signer).swap(
        tokenIn,
        ethers.parseEther(amountIn.toString())
      );
      await tx.wait();
      message.success('Swap successful!');
    } catch (error) {
      console.error('Swap failed:', error);
      message.error('Swap failed');
    }
    setLoading(false);
  };

  const selectedTokenIn = tokens.find(t => t.address === tokenIn);
  const selectedTokenOut = tokens.find(t => t.address === tokenOut);

  return (
    <StyledCard>
      <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>Swap Tokens</Title>
      
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
                <Option key={token.address} value={token.address}>
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
          onClick={() => {
            const temp = tokenIn;
            setTokenIn(tokenOut);
            setTokenOut(temp);
          }}
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
              value={amountOut} // 显示动态计算的输出金额
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
                <Option key={token.address} value={token.address}>
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
        <Text>{exchangeRate ? `1 ${getTokenName(tokenIn)} = ${exchangeRate} ${getTokenName(tokenOut)}` : 'Calculating...'}</Text>
      </Row>

      <SwapButton
        type="primary"
        size="large"
        onClick={handleSwap}
        loading={loading}
        disabled={!tokenIn || !tokenOut || amountIn <= 0 || tokenIn === tokenOut}
      >
        {tokenIn && tokenOut ? `Swap ${selectedTokenIn?.name} to ${selectedTokenOut?.name}` : 'Select Tokens'}
      </SwapButton>
    </StyledCard>
  );
}

export default SwapPage;