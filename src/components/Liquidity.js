import React, { useState, useEffect } from 'react';
import { Layout, Button, Select, Input, message, Card, Row, Col, Typography, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Web3 from 'web3';

const { Content } = Layout;
const { Option } = Select;
const { Text } = Typography;

// 完全保留原有的常量和ABI定义
const fetchTokenRatio = async (tokenA, tokenB) => {
  return 2;
};

//需要确保与部署的ERC20合约ABI一致
const ERC20_ABI = [
  {
    "constant": false,
    "inputs": [
      { "name": "_spender", "type": "address" },
      { "name": "_value", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "name": "success", "type": "bool" }],
    "payable": false,
    "type": "function"
  },
  // ... 保留原有所有ABI定义
];

const contractABI = [
  // ... 需要替换为实际的流动性合约ABI
];
const contractAddress = 'YOUR_CONTRACT_ADDRESS'; //需要替换为实际合约地址

function Liquidity() {
  const [tokenA, setTokenA] = useState('');
  const [tokenB, setTokenB] = useState('');
  const [ratio, setRatio] = useState(null);
  const [amountA, setAmountA] = useState(0);
  const [amountB, setAmountB] = useState(0);
  const [loading, setLoading] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isTokenSelected, setIsTokenSelected] = useState(false);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        
        try {
          const accounts = await web3Instance.eth.requestAccounts();
          setAccount(accounts[0]);
          const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
          setContract(contractInstance);
        } catch (error) {
          message.error('Please connect your wallet');
        }
      } else {
        message.error('Please install MetaMask');
      }
    };
    
    initWeb3();
  }, []);

  // 完全保留原有的所有函数逻辑
  const handleAddLiquidity = async () => {
    if (amountA > 0 && amountB > 0) {
      setLoading(true);
      try {
        const tokenAContract = new web3.eth.Contract(ERC20_ABI, tokenA);
        const tokenBContract = new web3.eth.Contract(ERC20_ABI, tokenB);

        await tokenAContract.methods.approve(contractAddress, amountA).send({ from: account });
        await tokenBContract.methods.approve(contractAddress, amountB).send({ from: account });
        
        await contract.methods.addLiquidity(tokenA, amountA, tokenB, amountB).send({ from: account });
        
        message.success('Liquidity added successfully!');
      } catch (error) {
        message.error('Failed to add liquidity');
      } finally {
        setLoading(false);
      }
    } else {
      message.error('Please input valid amounts');
    }
  };

  const handleContinue = async () => {
    if (tokenA && tokenB && tokenA !== tokenB) {
      const ratioFromBackend = await fetchTokenRatio(tokenA, tokenB);
      setRatio(ratioFromBackend);
      setAmountB(amountA * ratioFromBackend);
      setIsTokenSelected(true);
    } else {
      message.error('Please choose different tokens');
    }
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
    setRatio(null);
    setAmountA(0);
    setAmountB(0);
    setIsTokenSelected(false);
  };

  const handleAmountAChange = (e) => {
    const value = parseFloat(e.target.value);
    setAmountA(value);
    if (ratio) {
      setAmountB(value * ratio);
    }
  };

  const handleAmountBChange = (e) => {
    const value = parseFloat(e.target.value);
    setAmountB(value);
    if (ratio) {
      setAmountA(value / ratio);
    }
  };

  return (
    <Layout style={{ background: '#f5f7fa', minHeight: '100vh' }}>
      <Content style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
        <Card
          title={<Text strong>Select Pair</Text>}
          style={{ borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
        >
          <div style={{ marginBottom: '24px' }}>
            <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>Token 1</Text>
            <Row gutter={8}>
              <Col span={16}>
                <Input
                  placeholder="0.0"
                  value={amountA}
                  onChange={handleAmountAChange}
                  type="number"
                  disabled={!isTokenSelected}
                  size="large"
                  style={{ borderRadius: '8px' }}
                />
              </Col>
              <Col span={8}>
                <Select
                  value={tokenA}
                  onChange={handleTokenAChange}
                  placeholder="Select"
                  disabled={isTokenSelected}
                  size="large"
                  style={{ width: '100%', borderRadius: '8px' }}
                >
                  <Option value="tokenA">TokenA</Option>
                  <Option value="tokenB">TokenB</Option>
                </Select>
              </Col>
            </Row>
          </div>

          <div style={{ textAlign: 'center', margin: '16px 0' }}>
            <PlusOutlined style={{ fontSize: '20px', color: '#666' }} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>Token 2</Text>
            <Row gutter={8}>
              <Col span={16}>
                <Input
                  placeholder="0.0"
                  value={amountB}
                  onChange={handleAmountBChange}
                  type="number"
                  disabled={!isTokenSelected}
                  size="large"
                  style={{ borderRadius: '8px' }}
                />
              </Col>
              <Col span={8}>
                <Select
                  value={tokenB}
                  onChange={handleTokenBChange}
                  placeholder="Select"
                  disabled={isTokenSelected}
                  size="large"
                  style={{ width: '100%', borderRadius: '8px' }}
                >
                  <Option value="tokenA">TokenA</Option>
                  <Option value="tokenB">TokenB</Option>
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
                    1 {tokenA} = {ratio} {tokenB}
                  </Text>
                </Row>
                <Row justify="space-between">
                  <Text type="secondary">Fee Tier</Text>
                  <Text>0.05%</Text>
                </Row>
              </div>
              
              <Button
                type="primary"
                block
                size="large"
                loading={loading}
                onClick={handleAddLiquidity}
                disabled={amountA <= 0 || amountB <= 0}
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
        </Card>
      </Content>
    </Layout>
  );
}

export default Liquidity;