import React, { useState, useCallback } from 'react';
import { Layout, Button, Select, Input, message, Card, Row, Col, Typography, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ethers } from 'ethers';
import styled from 'styled-components';
import { useWallet } from '../contexts/WalletContext';

const { Content } = Layout;
const { Option } = Select;
const { Text } = Typography;

const StyledInput = styled(Input)`
  border-radius: 8px;
`;

// 调整卡片样式，增加最大宽度
const StyledCard = styled(Card)`
  max-width: 600px; // 从默认的600px增加到800px
  margin: 40px auto;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

function Liquidity() {
  const { contracts } = useWallet();
  
  // 代币选择和金额状态
  const [tokenA, setTokenA] = useState('');
  const [tokenB, setTokenB] = useState('');
  const [ratio, setRatio] = useState(null);
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTokenSelected, setIsTokenSelected] = useState(false);

  // 动态获取可用的代币列表
  const supportedTokens = [
    { name: 'ETH', address: contracts?.eth?.target, icon: 'Ξ' },
    { name: 'SHIT', address: contracts?.shit?.target, icon: '💩' },
    { name: 'USDT', address: contracts?.usdt?.target, icon: '$' },
    { name: 'DAI', address: contracts?.dai?.target, icon: '◈' },
  ].filter(token => token.address);

  // 根据选择的代币确定对应的池子合约
  const getPoolContract = useCallback(() => {
    if (!contracts?.usdt || !contracts?.dai || !contracts?.shit || !contracts?.eth) return null;
    
    if (
      (tokenA === contracts.usdt.target && tokenB === contracts.dai.target) ||
      (tokenA === contracts.dai.target && tokenB === contracts.usdt.target)
    ) {
      return contracts.usdtDaiPool;
    }
    if (
      (tokenA === contracts.usdt.target && tokenB === contracts.eth.target) ||
      (tokenA === contracts.eth.target && tokenB === contracts.usdt.target)
    ) {
      return contracts.usdtEthPool;
    }
    if (
      (tokenA === contracts.usdt.target && tokenB === contracts.shit.target) ||
      (tokenA === contracts.shit.target && tokenB === contracts.usdt.target)
    ) {
      return contracts.usdtShitPool;
    }
    if (
      (tokenA === contracts.dai.target && tokenB === contracts.eth.target) ||
      (tokenA === contracts.eth.target && tokenB === contracts.dai.target)
    ) {
      return contracts.daiEthPool;
    }
    if (
      (tokenA === contracts.shit.target && tokenB === contracts.eth.target) ||
      (tokenA === contracts.eth.target && tokenB === contracts.shit.target)
    ) {
      return contracts.shitEthPool;
    }
    if (
      (tokenA === contracts.dai.target && tokenB === contracts.shit.target) ||
      (tokenA === contracts.shit.target && tokenB === contracts.dai.target)
    ) {
      return contracts.daiShitPool;
    }
    
    return null;
  }, [contracts, tokenA, tokenB]);

  // 添加流动性
  const handleAddLiquidity = async () => {
    if (!amountA || !amountB || parseFloat(amountA) <= 0 || parseFloat(amountB) <= 0) {
      message.error('Please input valid amounts');
      return;
    }

    const poolContract = getPoolContract();
    if (!poolContract) {
      message.error('No pool contract found for the selected tokens');
      return;
    }

    setLoading(true);
    try {
      // const amountAWei = ethers.parseUnits(amountA.toString(), 18);
      // const amountBWei = ethers.parseUnits(amountB.toString(), 18);
      const minLpAmount = 0; // 最小流动性代币数量，可以设置一个合理的值
      // 调用合约的 addLiquidity 函数
      const tx = await poolContract.addLiquidity(1, 1, minLpAmount);
      message.loading('Transaction is being processed...', 0);

      // // 等待交易完成
      await tx.wait();
      
      // 成功提示
      message.destroy();
      message.success('Liquidity added successfully!');
      
      // 重置输入
      setAmountA('');
      setAmountB('');
    } catch (error) {
      console.error('Failed to add liquidity:', error);
      message.destroy();
      message.error(`Failed to add liquidity: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 点击继续按钮
  const handleContinue = async () => {
    if (!tokenA || !tokenB || tokenA === tokenB) {
      message.error('Please choose different tokens');
      return;
    }

    setIsTokenSelected(true);
  };

  // Token A 变化
  const handleTokenAChange = (value) => {
    if (!isTokenSelected) {
      setTokenA(value);
    }
  };

  // Token B 变化
  const handleTokenBChange = (value) => {
    if (!isTokenSelected) {
      setTokenB(value);
    }
  };

  // 返回选择代币界面
  const handleBack = () => {
    setTokenA('');
    setTokenB('');
    setRatio(null);
    setAmountA('');
    setAmountB('');
    setIsTokenSelected(false);
  };

  // 输入金额 A 变化
  const handleAmountAChange = async (e) => {
    const value = e.target.value;
    setAmountA(value);

    if (isTokenSelected && value && parseFloat(value) > 0) {
      try {
        const poolContract = getPoolContract();
        if (!poolContract) return;

        const amountInWei = ethers.parseUnits(value, 18);
        const isA = true; // 从 A 到 B 的方向
        const pairedAmount = await poolContract.getPairedAmount(amountInWei, isA);
        
        const pairedAmountFormatted = ethers.formatUnits(pairedAmount, 18);
        setAmountB(pairedAmountFormatted);
        
        // 计算比率
        const ratio = parseFloat(pairedAmountFormatted) / parseFloat(value);
        setRatio(ratio);
      } catch (error) {
        console.error('Failed to fetch paired amount:', error);
      }
    } else if (value === '' || parseFloat(value) === 0) {
      setAmountB('');
    }
  };

  // 输入金额 B 变化（可选功能）
  const handleAmountBChange = async (e) => {
    const value = e.target.value;
    setAmountB(value);
    
    if (isTokenSelected && value && parseFloat(value) > 0 && ratio) {
      setAmountA((parseFloat(value) / ratio).toString());
    } else if (value === '' || parseFloat(value) === 0) {
      setAmountA('');
    }
  };
  

  return (
    <Layout style={{ background: '#f5f7fa', minHeight: '100vh' }}>
      <Content style={{ padding: '24px' }}>
        {/* 使用自定义的StyledCard代替原来的Card组件 */}
        <StyledCard
          title={<Text strong>Select Pair</Text>}
          style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
        >
          <div style={{ marginBottom: '24px' }}>
            <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>Token 1</Text>
            <Row gutter={16}>
              <Col span={18}>
                <StyledInput
                  placeholder="0.0"
                  value={amountA}
                  onChange={handleAmountAChange}
                  type="number"
                  disabled={!isTokenSelected}
                  size="large"
                />
              </Col>
              <Col span={6}>
                <Select
                  value={tokenA}
                  onChange={handleTokenAChange}
                  placeholder="Select"
                  disabled={isTokenSelected || supportedTokens.length === 0}
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
              </Col>
            </Row>
          </div>

          <div style={{ textAlign: 'center', margin: '16px 0' }}>
            <PlusOutlined style={{ fontSize: '20px', color: '#666' }} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>Token 2</Text>
            <Row gutter={16}>
              <Col span={18}>
                <StyledInput
                  placeholder="0.0"
                  value={amountB}
                  onChange={handleAmountBChange}
                  type="number"
                  disabled={!isTokenSelected}
                  size="large"
                />
              </Col>
              <Col span={6}>
                <Select
                  value={tokenB}
                  onChange={handleTokenBChange}
                  placeholder="Select"
                  disabled={isTokenSelected || supportedTokens.length === 0}
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
              </Col>
            </Row>
          </div>

          {!isTokenSelected ? (
            <Button
              type="primary"
              block
              size="large"
              onClick={handleContinue}
              disabled={!tokenA || !tokenB || tokenA === tokenB}
              style={{ borderRadius: '8px', height: '48px' }}
            >
              Continue
            </Button>
          ) : (
            <>
              <Divider />
              <div style={{ marginBottom: '24px' }}>
                <Row justify="space-between" style={{ marginBottom: '8px' }}>
                  <Text type="secondary">Exchange Rate</Text>
                  <Text>
                    1 {supportedTokens.find((t) => t.address === tokenA)?.name} = {ratio ? ratio.toFixed(6) : '-'} {supportedTokens.find((t) => t.address === tokenB)?.name}
                  </Text>
                </Row>
              </div>

              <Button
                type="primary"
                block
                size="large"
                loading={loading}
                onClick={handleAddLiquidity}
                disabled={!amountA || !amountB || parseFloat(amountA) <= 0 || parseFloat(amountB) <= 0}
                style={{
                  borderRadius: '8px',
                  height: '48px',
                  marginBottom: '16px',
                  background: 'linear-gradient(135deg, #1890ff, #096dd9)',
                  border: 'none'
                }}
              >
                Add Liquidity
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

export default Liquidity;