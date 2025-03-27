import React, { useState } from 'react';
import { Select, InputNumber, Button, message, Row, Col  } from 'antd';  
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom'; 

const { Option } = Select;

function Swap({ swapContract }) {
  const [tokenIn, setTokenIn] = useState('');
  const [tokenOut, setTokenOut] = useState('');
  const [amountIn, setAmountIn] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  // 假设支持10种代币，实际地址从后端获取
  const tokens = [
    { name: 'TokenA', address: '0xTokenA...' },
    { name: 'TokenB', address: '0xTokenB...' },
    // 添加更多代币...
  ].slice(0, 10);

  // const handleAmountInChange = (e) => { 
  //   setAmountIn(e.target.value);
  // };
  
  const handleSwap = async () => {
    if (!tokenIn || !tokenOut || amountIn <= 0) {
      message.error('Please fill in all fields');
      return;
    }
    if (tokenIn === tokenOut) { // 检查 tokenIn 和 tokenOut 是否相同
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

  const navigateToPool = () => { 
    navigate('/Pool');
  };

  return (
    <div style={{ margin: '20px' }}>
      <Select
        style={{ width: 120, marginRight: 10 }}
        onChange={setTokenIn}
        placeholder="From"
        value={tokenIn} // 使 tokenIn 选项值与状态保持同步
      >
        {tokens.map((token) => (
          <Option key={token.address} value={token.address}>
            {token.name}
          </Option>
        ))}
      </Select>
      <InputNumber
        min={0}
        value={amountIn}
        onChange={(value) => setAmountIn(value || 0)}
        style={{ marginRight: 10 }}
      />
      <Select
        style={{ width: 120, marginRight: 10 }}
        onChange={setTokenOut}
        placeholder="To"
        value={tokenOut} // 使 tokenOut 选项值与状态保持同步
      >
        {tokens.map((token) => (
          <Option key={token.address} value={token.address}>
            {token.name}
          </Option>
        ))}
      
      {/* 代币相同时禁用Swap按钮 */}
      </Select> 
      <Button type="primary" onClick={handleSwap} loading={loading} disabled={tokenIn === tokenOut} >    
        Swap
      </Button>

      {/* 增加pool部分 */}
      <div style={{ marginTop: '20px', marginBottom: '10px', fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>
        <pre>
        &nbsp;     Pool            TVL         APR       1D vol     30D vol   1D vol/TVL
        </pre>
      </div>

      <Row gutter={16} justify="center" align="middle">
        <Col span={24} >
        <Button block onClick={navigateToPool} style={{ fontSize: '16px', height: '50px' }}>
            <img src="/images/image1.png" alt="USDC/ETH" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
            <pre>
              USDC/ETH      $154.6M      2.465%      $20.9M      $10.1B      0.14
            </pre>
          </Button>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: '10px' }}>
        <Col span={24}>
          <Button block onClick={navigateToPool} style={{ fontSize: '16px', height: '50px' }}>
            <img src="/images/image2.png" alt="WBTC/USDC" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
            <pre>
              BTC/USDC      $131.4M      2.389%      $2.9M       $1.1B       0.02  
            </pre>
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default Swap;