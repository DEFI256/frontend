import React, { useState } from 'react';
import { Select, InputNumber, Button, message } from 'antd';
import { ethers } from 'ethers';

const { Option } = Select;

function Swap({ swapContract }) {
  const [tokenIn, setTokenIn] = useState('');
  const [tokenOut, setTokenOut] = useState('');
  const [amountIn, setAmountIn] = useState(0);
  const [loading, setLoading] = useState(false);

  // 假设支持10种代币，实际地址从后端获取
  const tokens = [
    { name: 'TokenA', address: '0xTokenA...' },
    { name: 'TokenB', address: '0xTokenB...' },
    // 添加更多代币...
  ].slice(0, 10);

  const handleSwap = async () => {
    if (!tokenIn || !tokenOut || amountIn <= 0) {
      message.error('Please fill in all fields');
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

  return (
    <div style={{ margin: '20px' }}>
      <Select
        style={{ width: 120, marginRight: 10 }}
        onChange={setTokenIn}
        placeholder="From"
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
      >
        {tokens.map((token) => (
          <Option key={token.address} value={token.address}>
            {token.name}
          </Option>
        ))}
      </Select>
      <Button type="primary" onClick={handleSwap} loading={loading}>
        Swap
      </Button>
    </div>
  );
}

export default Swap;