import React, { useState } from 'react';
import { Select, InputNumber, Button, message, Card, Row, Col, Typography } from 'antd';
import { ethers } from 'ethers';
import styled from 'styled-components';
import { useWallet } from '../contexts/WalletContext';
import { 
  usdtAddress, 
  daiAddress, 
  shitAddress, 
  ethAddress 
} from '../abis/contractAddeess';

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

// 更新为与合约地址匹配的代币列表
const buyableTokens = [
  { name: 'ETH', address: ethAddress, icon: 'Ξ', decimals: 18 },
  { name: 'SHIT', address: shitAddress, icon: '💩', decimals: 18 },
  { name: 'USDT', address: usdtAddress, icon: '$', decimals: 18 },
  { name: 'DAI', address: daiAddress, icon: '◈', decimals: 18 },
];

function BuyPage() {
  const [token, setToken] = useState('');
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { walletAddress, contracts, signer, fetchTokenBalances } = useWallet();

  // 获取当前选择的代币信息
  const selectedToken = buyableTokens.find(t => t.address === token);
  
  // 根据选择的代币获取对应的合约
  const getContractByAddress = (address) => {
    if (address === ethAddress) return contracts.eth;
    if (address === shitAddress) return contracts.shit;
    if (address === usdtAddress) return contracts.usdt;
    if (address === daiAddress) return contracts.dai;
    return null;
  };

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

  // 处理购买操作
  const handleBuy = async () => {
    if (!token || amount <= 0 || !walletAddress) {
      message.error('Please select a token, enter the amount, and connect your wallet.');
      return;
    }

    setLoading(true);
    try {
      // 获取选择的代币合约
      const contract = getContractByAddress(token);
      
      if (!contract) {
        throw new Error('Contract not found for selected token');
      }

      // 将用户输入的数量转换为最小单位
      const amountInWei = parseTokenAmount(amount, token);

      // 调用合约的mint函数 - 参数：接收者地址和数量
      const tx = await contract.connect(signer).mint(walletAddress, amountInWei);
      
      // 等待交易确认
      await tx.wait();

      // 成功提示
      message.success(`Successfully minted ${amount} ${selectedToken.name} to your wallet!`);
      
      // 刷新代币余额 (如果useWallet有此方法)
      if (typeof fetchTokenBalances === 'function') {
        fetchTokenBalances();
      }
    } catch (error) {
      console.error('Failed to mint tokens:', error);
      message.error(`Failed to mint tokens: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledCard>
      <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>Buy Tokens</Title>

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
              precision={2}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
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
        {token ? `Buy ${amount} ${selectedToken.name}` : 'Select a token'}
      </BuyButton>
    </StyledCard>
  );
}

export default BuyPage;