import React, { useState } from 'react';
import { Select, InputNumber, Button, message, Card, Row, Col, Typography } from 'antd';
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

const BuyButton = styled(Button)`
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

const buyableTokens = [
  { name: 'ETH', address: '0xETH...', icon: 'Ξ', decimals: 18 },
  { name: 'SHIT', address: '0xSHIT...', icon: '💩', decimals: 18 },
  { name: 'USDC', address: '0xUSDC...', icon: '$', decimals: 6 },
  { name: 'DAI', address: '0xDAI...', icon: '◈', decimals: 18 },
];

function BuyPage({ swapContract }) {
  const [token, setToken] = useState('');
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  // 获取当前选择的代币信息
  const selectedToken = buyableTokens.find(t => t.address === token);

  // 处理金额输入变化
  const handleAmountChange = (value) => {
    setAmount(value || 0);
  };

  // 将用户输入的单位转换为wei
  const parseTokenAmount = (amount, tokenAddress) => {
    const token = buyableTokens.find(t => t.address === tokenAddress);
    if (!token) return '0';
    return ethers.parseUnits(amount.toString(), token.decimals).toString();
  };

  // 将合约返回的wei转换为可读单位
  const formatTokenAmount = (amountInWei, tokenAddress) => {
    const token = buyableTokens.find(t => t.address === tokenAddress);
    if (!token) return '0';
    return ethers.formatUnits(amountInWei, token.decimals);
  };

  // 处理购买操作
  const handleBuy = async () => {
    if (!token || amount <= 0) {
      message.error('Please select a token and enter the amount.');
      return;
    }

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // 将用户输入的数量转换为最小单位
      const amountInWei = parseTokenAmount(amount, token);
      
      // 调用合约的mint函数
      const tx = await swapContract.connect(signer).mint(
        token,
        amountInWei
      );
      
      await tx.wait();
      
      // 如果需要显示交易结果，可以查询余额等
      // const balance = await swapContract.getBalance(token);
      // const formattedBalance = formatTokenAmount(balance, token);
      
      message.success(`Success! ${amount} ${selectedToken.name}`);
    } catch (error) {
      console.error('Fail.', error);
      message.error(`Fail. ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledCard>
      <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>Buy</Title>
      
      <TokenInputContainer>
        <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
          <Text type="secondary">Token</Text>
        </Row>
        <Row gutter={8} align="middle">
          <Col span={24}>
            <TokenSelect
              size="large"
              onChange={setToken}
              placeholder="Select the token you want to buy."
              value={token}
            >
              {buyableTokens.map((token) => (
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

      <TokenInputContainer>
        <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
          <Text type="secondary">Amount</Text>
        </Row>
        <Row gutter={8} align="middle">
          <Col span={24}>
            <StyledInputNumber
              min={0}
              value={amount}
              onChange={handleAmountChange}
              size="large"
              placeholder="0.0"
              style={{ width: '100%' }}
              precision={selectedToken?.decimals || 18}
            />
          </Col>
        </Row>
      </TokenInputContainer>

      <BuyButton
        type="primary"
        size="large"
        onClick={handleBuy}
        loading={loading}
        disabled={!token || amount <= 0}
      >
        {token ? `Buy ${amount} ${selectedToken.name}` : 'Please select a token.'}
      </BuyButton>
    </StyledCard>
  );
}

export default BuyPage;