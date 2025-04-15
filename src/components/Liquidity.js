// import React, { useState, useCallback } from 'react';
// import { Layout, Button, Select, Input, message, Card, Row, Col, Typography, Divider } from 'antd';
// import { PlusOutlined } from '@ant-design/icons';
// import { ethers } from 'ethers';
// import styled from 'styled-components';
// import { useWallet } from '../contexts/WalletContext';

// const { Content } = Layout;
// const { Option } = Select;
// const { Text } = Typography;

// const StyledInput = styled(Input)`
//   border-radius: 8px;
// `;

// // 调整卡片样式，增加最大宽度
// const StyledCard = styled(Card)`
//   max-width: 600px; // 从默认的600px增加到800px
//   margin: 40px auto;
//   border-radius: 16px;
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
// `;

// function Liquidity() {
//   const { contracts } = useWallet();

//   // 代币选择和金额状态
//   const [tokenA, setTokenA] = useState('');
//   const [tokenB, setTokenB] = useState('');
//   const [ratio, setRatio] = useState(null);
//   const [amountA, setAmountA] = useState('');
//   const [amountB, setAmountB] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [isA, setIsA] = useState(false); // 用于判断是A到B还是B到A
//   const [isTokenSelected, setIsTokenSelected] = useState(false);

//   // 动态获取可用的代币列表
//   const supportedTokens = [
//     { name: 'ETH', address: contracts?.eth?.target, icon: 'Ξ' },
//     { name: 'SHIT', address: contracts?.shit?.target, icon: '💩' },
//     { name: 'USDT', address: contracts?.usdt?.target, icon: '$' },
//     { name: 'DAI', address: contracts?.dai?.target, icon: '◈' },
//   ].filter(token => token.address);

//   // 根据选择的代币确定对应的池子合约
//   const getPoolContract = useCallback(() => {
//     if (!contracts?.usdt || !contracts?.dai || !contracts?.shit || !contracts?.eth) return null;

//     if (
//       (tokenA === contracts.usdt.target && tokenB === contracts.dai.target) ||
//       (tokenA === contracts.dai.target && tokenB === contracts.usdt.target)
//     ) {
//       return contracts.usdtDaiPool;
//     }
//     if (
//       (tokenA === contracts.usdt.target && tokenB === contracts.eth.target) ||
//       (tokenA === contracts.eth.target && tokenB === contracts.usdt.target)
//     ) {
//       return contracts.usdtEthPool;
//     }
//     if (
//       (tokenA === contracts.usdt.target && tokenB === contracts.shit.target) ||
//       (tokenA === contracts.shit.target && tokenB === contracts.usdt.target)
//     ) {
//       return contracts.usdtShitPool;
//     }
//     if (
//       (tokenA === contracts.dai.target && tokenB === contracts.eth.target) ||
//       (tokenA === contracts.eth.target && tokenB === contracts.dai.target)
//     ) {
//       return contracts.daiEthPool;
//     }
//     if (
//       (tokenA === contracts.shit.target && tokenB === contracts.eth.target) ||
//       (tokenA === contracts.eth.target && tokenB === contracts.shit.target)
//     ) {
//       return contracts.shitEthPool;
//     }
//     if (
//       (tokenA === contracts.dai.target && tokenB === contracts.shit.target) ||
//       (tokenA === contracts.shit.target && tokenB === contracts.dai.target)
//     ) {
//       return contracts.daiShitPool;
//     }

//     return null;
//   }, [contracts, tokenA, tokenB]);

//   // 添加流动性
//   const handleAddLiquidity = async () => {
//     if (!amountA || !amountB || parseFloat(amountA) <= 0 || parseFloat(amountB) <= 0) {
//       message.error('Please input valid amounts');
//       return;
//     }

//     const poolContract = getPoolContract();
//     if (!poolContract) {
//       message.error('No pool contract found for the selected tokens');
//       return;
//     }

//     setLoading(true);
//     try {
//       const amountAWei = ethers.parseUnits(amountA.toString(), 18);
//       const amountBWei = ethers.parseUnits(amountB.toString(), 18);
//       const minLpAmount = 0; // 最小流动性代币数量，可以设置一个合理的值

//       // 获取代币 A 的合约实例
//       let tokenAContract;
//       if (tokenA === contracts.usdt.target) tokenAContract = contracts.usdt;
//       else if (tokenA === contracts.dai.target) tokenAContract = contracts.dai;
//       else if (tokenA === contracts.shit.target) tokenAContract = contracts.shit;
//       else if (tokenA === contracts.eth.target) tokenAContract = contracts.eth;

//       // 获取代币 B 的合约实例
//       let tokenBContract;
//       if (tokenB === contracts.usdt.target) tokenBContract = contracts.usdt;
//       else if (tokenB === contracts.dai.target) tokenBContract = contracts.dai;
//       else if (tokenB === contracts.shit.target) tokenBContract = contracts.shit;
//       else if (tokenB === contracts.eth.target) tokenBContract = contracts.eth;

//       if (!tokenAContract || !tokenBContract) {
//         message.error('Token contract not found');
//         setLoading(false);
//         return;
//       }

//       // 获取代币名称
//       const tokenAName = supportedTokens.find(t => t.address === tokenA)?.name;
//       const tokenBName = supportedTokens.find(t => t.address === tokenB)?.name;

//       // 批准代币 A
//       message.loading(`Approving ${tokenAName}...`, 0);
//       try {
//         const approveTxA = await tokenAContract.approve(poolContract.target, amountAWei);
//         await approveTxA.wait();
//         message.destroy();
//         message.success(`${tokenAName} approved!`);
//       } catch (error) {
//         message.destroy();
//         message.error(`Failed to approve ${tokenAName}: ${error.message}`);
//         setLoading(false);
//         return;
//       }

//       // 批准代币 B
//       message.loading(`Approving ${tokenBName}...`, 0);
//       try {
//         const approveTxB = await tokenBContract.approve(poolContract.target, amountBWei);
//         await approveTxB.wait();
//         message.destroy();
//         message.success(`${tokenBName} approved!`);
//       } catch (error) {
//         message.destroy();
//         message.error(`Failed to approve ${tokenBName}: ${error.message}`);
//         setLoading(false);
//         return;
//       }

//       // 添加流动性
//       message.loading('Adding liquidity...', 0);
//       console.log(poolContract, amountAWei, amountBWei, minLpAmount);
//       if (isA) {
//         console.log(isA,amountAWei, amountBWei, minLpAmount);
//         const tx = await poolContract.addLiquidity(amountAWei, amountBWei, minLpAmount);
//         await tx.wait();
//       } else {
//         console.log(isA,amountBWei, amountAWei, minLpAmount);
//         const tx = await poolContract.addLiquidity(amountBWei, amountAWei, minLpAmount);
//         await tx.wait();
//       }
//       // 成功提示
//       message.destroy();
//       message.success('Liquidity added successfully!');

//       // 重置输入
//       setAmountA('');
//       setAmountB('');
//     } catch (error) {
//       console.error('Failed to add liquidity:', error);
//       message.destroy();
//       message.error(`Failed to add liquidity: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

// // 点击继续按钮
// const handleContinue = async () => {
//   if (!tokenA || !tokenB || tokenA === tokenB) {
//     message.error('Please choose different tokens');
//     return;
//   }

//   // 当所有的第一个选择是usdt的时候
//   if (tokenA === contracts.usdt.target) {
//     setIsA(true);
//   }
//   // 第一个选择是dai,第二个选择是shit或eth的时候
//   else if (tokenA === contracts.dai.target &&
//     (tokenB === contracts.shit.target || tokenB === contracts.eth.target)) {
//     setIsA(true);
//   }
//   // 第一个选择是shit第二个选择是eth的时候
//   else if (tokenA === contracts.shit.target && tokenB === contracts.eth.target) {
//     setIsA(true);
//   }
//   // 其余的情况都是false
//   else {
//     setIsA(false);
//   }

//   setIsTokenSelected(true);
// };

// // Token A 变化
// const handleTokenAChange = (value) => {
//   if (!isTokenSelected) {
//     setTokenA(value);
//   }
// };

// // Token B 变化
// const handleTokenBChange = (value) => {
//   if (!isTokenSelected) {
//     setTokenB(value);
//   }
// };

//   // 返回选择代币界面
//   const handleBack = () => {
//     setTokenA('');
//     setTokenB('');
//     setRatio(null);
//     setAmountA('');
//     setAmountB('');
//     setIsTokenSelected(false);
//   };

// // 输入金额 A 变化
// const handleAmountAChange = async (e) => {
//   const value = e.target.value;
//   setAmountA(value);

//   if (isTokenSelected && value && parseFloat(value) > 0) {
//     try {
//       const poolContract = getPoolContract();
//       if (!poolContract) return;

//       const amountInWei = ethers.parseUnits(value, 18);
//       const pairedAmount = await poolContract.getPairedAmount(amountInWei, isA);

//       const pairedAmountFormatted = ethers.formatUnits(pairedAmount, 18);
//       setAmountB(pairedAmountFormatted);

//       // 计算比率
//       const ratio = parseFloat(pairedAmountFormatted) / parseFloat(value);
//       setRatio(ratio);
//     } catch (error) {
//       console.error('Failed to fetch paired amount:', error);
//     }
//   } else if (value === '' || parseFloat(value) === 0) {
//     setAmountB('');
//   }
// };

// // 输入金额 B 变化（可选功能）
// const handleAmountBChange = async (e) => {
//   const value = e.target.value;
//   setAmountB(value);

//   if (isTokenSelected && value && parseFloat(value) > 0) {
//     try {
//       const poolContract = getPoolContract();
//       if (!poolContract) return;

//       const amountInWei = ethers.parseUnits(value, 18);
//       // 这里使用 !isA 作为参数，表示反向计算
//       const pairedAmount = await poolContract.getPairedAmount(amountInWei, !isA);

//       const pairedAmountFormatted = ethers.formatUnits(pairedAmount, 18);
//       setAmountA(pairedAmountFormatted);

//       // 计算比率 (B/A)
//       const newRatio = parseFloat(value) / parseFloat(pairedAmountFormatted);
//       setRatio(newRatio);
//     } catch (error) {
//       console.error('Failed to fetch paired amount:', error);
//     }
//   } else if (value === '' || parseFloat(value) === 0) {
//     setAmountA('');
//   }
// };


//   return (
//     <Layout style={{ background: '#f5f7fa', minHeight: '100vh' }}>
//       <Content style={{ padding: '24px' }}>
//         {/* 使用自定义的StyledCard代替原来的Card组件 */}
//         <StyledCard
//           title={<Text strong>Select Pair</Text>}
//           style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
//         >
//           <div style={{ marginBottom: '24px' }}>
//             <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>Token 1</Text>
//             <Row gutter={16}>
//               <Col span={18}>
//                 <StyledInput
//                   placeholder="0.0"
//                   value={amountA}
//                   onChange={handleAmountAChange}
//                   type="number"
//                   disabled={!isTokenSelected}
//                   size="large"
//                 />
//               </Col>
//               <Col span={6}>
//                 <Select
//                   value={tokenA}
//                   onChange={handleTokenAChange}
//                   placeholder="Select"
//                   disabled={isTokenSelected || supportedTokens.length === 0}
//                   size="large"
//                   style={{ width: '100%', borderRadius: '8px' }}
//                 >
//                   {supportedTokens.map((token) => (
//                     <Option key={token.address} value={token.address}>
//                       <Row align="middle">
//                         <span style={{ marginRight: 8 }}>{token.icon}</span>
//                         {token.name}
//                       </Row>
//                     </Option>
//                   ))}
//                 </Select>
//               </Col>
//             </Row>
//           </div>

//           <div style={{ textAlign: 'center', margin: '16px 0' }}>
//             <PlusOutlined style={{ fontSize: '20px', color: '#666' }} />
//           </div>

//           <div style={{ marginBottom: '24px' }}>
//             <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>Token 2</Text>
//             <Row gutter={16}>
//               <Col span={18}>
//                 <StyledInput
//                   placeholder="0.0"
//                   value={amountB}
//                   onChange={handleAmountBChange}
//                   type="number"
//                   disabled={!isTokenSelected}
//                   size="large"
//                 />
//               </Col>
//               <Col span={6}>
//                 <Select
//                   value={tokenB}
//                   onChange={handleTokenBChange}
//                   placeholder="Select"
//                   disabled={isTokenSelected || supportedTokens.length === 0}
//                   size="large"
//                   style={{ width: '100%', borderRadius: '8px' }}
//                 >
//                   {supportedTokens.filter(token => token.address !== tokenA).map((token) => (
//                     <Option key={token.address} value={token.address}>
//                       <Row align="middle">
//                         <span style={{ marginRight: 8 }}>{token.icon}</span>
//                         {token.name}
//                       </Row>
//                     </Option>
//                   ))}
//                 </Select>
//               </Col>
//             </Row>
//           </div>

//           {!isTokenSelected ? (
//             <Button
//               type="primary"
//               block
//               size="large"
//               onClick={handleContinue}
//               disabled={!tokenA || !tokenB || tokenA === tokenB}
//               style={{ borderRadius: '8px', height: '48px' }}
//             >
//               Continue
//             </Button>
//           ) : (
//             <>
//               <Divider />
//               <div style={{ marginBottom: '24px' }}>
//                 <Row justify="space-between" style={{ marginBottom: '8px' }}>
//                   <Text type="secondary">Exchange Rate</Text>
//                   <Text>
//                     1 {supportedTokens.find((t) => t.address === tokenA)?.name} = {ratio ? ratio.toFixed(6) : '-'} {supportedTokens.find((t) => t.address === tokenB)?.name}
//                   </Text>
//                 </Row>
//               </div>

//               <Button
//                 type="primary"
//                 block
//                 size="large"
//                 loading={loading}
//                 onClick={handleAddLiquidity}
//                 disabled={!amountA || !amountB || parseFloat(amountA) <= 0 || parseFloat(amountB) <= 0}
//                 style={{
//                   borderRadius: '8px',
//                   height: '48px',
//                   marginBottom: '16px',
//                   background: 'linear-gradient(135deg, #1890ff, #096dd9)',
//                   border: 'none'
//                 }}
//               >
//                 Add Liquidity
//               </Button>

//               <Button
//                 block
//                 size="large"
//                 onClick={handleBack}
//                 style={{ borderRadius: '8px', height: '48px' }}
//               >
//                 Back
//               </Button>
//             </>
//           )}
//         </StyledCard>
//       </Content>
//     </Layout>
//   );
// }

// export default Liquidity;


import React, { useState, useEffect, useCallback } from 'react';
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

const StyledCard = styled(Card)`
  max-width: 600px;
  margin: 40px auto;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

function Liquidity() {
  const { contracts, signer, walletAddress } = useWallet();

  const [tokenA, setTokenA] = useState('');
  const [tokenB, setTokenB] = useState('');
  const [ratio, setRatio] = useState(null);
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');
  const [loading, setLoading] = useState(false);
  const [isA, setIsA] = useState(false);
  const [isTokenSelected, setIsTokenSelected] = useState(false);
  const [lpBalance, setLpBalance] = useState('0');
  const [poolInfo, setPoolInfo] = useState({ reserveA: '0', reserveB: '0' });

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
      console.error(`LP token contract not found: ${key}`);
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
        console.log(`Try ${attempt + 1} - LP token address returned by the pool: ${lpTokenAddress}`);
        console.log(`Try ${attempt + 1} - Expected LP token address: ${lpTokenContract.target}`);
        console.log(`Try ${attempt + 1} - Check the wallet address for balance: ${walletAddress}`);

        if (lpTokenAddress.toLowerCase() !== lpTokenContract.target.toLowerCase()) {
          console.warn('LP token address does not match, please check contractAddeess.js configuration');
          message.warning('The LP token address may be configured incorrectly, please contact the administrator');
        }

        const balance = await lpTokenContract.balanceOf(walletAddress);
        const formattedBalance = ethers.formatUnits(balance, 18);
        console.log(`Try ${attempt + 1} - LP Token Balance: ${formattedBalance}`);
        setLpBalance(formattedBalance);
        return;
      } catch (error) {
        console.error(`Try ${attempt + 1} Failed to get LP balance:`, error);
        attempt++;
        if (attempt === maxRetries) {
          message.error('Failed to obtain LP token balance, please check the network or contract configuration');
          setLpBalance('0');
        }
        await new Promise(resolve => setTimeout(resolve, 5000)); // 增加间隔到 5 秒
      }
    }
  }, [getPoolContract, getLpTokenContract, signer, walletAddress]);

  const fetchPoolInfo = useCallback(async () => {
    const poolContract = getPoolContract();
    if (!poolContract) return;

    try {
      const [reserveA, reserveB, ,] = await poolContract.getReservesAndLiquidity();
      setPoolInfo({
        reserveA: ethers.formatUnits(reserveA, 18),
        reserveB: ethers.formatUnits(reserveB, 18),
      });
    } catch (error) {
      console.error('获取池子信息失败:', error);
    }
  }, [getPoolContract]);

  useEffect(() => {
    if (isTokenSelected) {
      fetchLpBalance();
      fetchPoolInfo();
    }
  }, [isTokenSelected, fetchLpBalance, fetchPoolInfo]);

  const handleAddLiquidity = async () => {
    if (!amountA || !amountB || parseFloat(amountA) <= 0 || parseFloat(amountB) <= 0) {
      message.error('请输入有效金额');
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
      const amountAWei = ethers.parseUnits(amountA.toString(), 18);
      const amountBWei = ethers.parseUnits(amountB.toString(), 18);
      const minLpAmount = 0;

      let tokenAContract, tokenBContract;
      if (tokenA === contracts.usdt.target) tokenAContract = contracts.usdt;
      else if (tokenA === contracts.dai.target) tokenAContract = contracts.dai;
      else if (tokenA === contracts.shit.target) tokenAContract = contracts.shit;
      else if (tokenA === contracts.eth.target) tokenAContract = contracts.eth;

      if (tokenB === contracts.usdt.target) tokenBContract = contracts.usdt;
      else if (tokenB === contracts.dai.target) tokenBContract = contracts.dai;
      else if (tokenB === contracts.shit.target) tokenBContract = contracts.shit;
      else if (tokenB === contracts.eth.target) tokenBContract = contracts.eth;

      if (!tokenAContract || !tokenBContract) {
        message.error('代币合约未找到');
        setLoading(false);
        return;
      }

      const tokenAName = supportedTokens.find(t => t.address === tokenA)?.name;
      const tokenBName = supportedTokens.find(t => t.address === tokenB)?.name;

      message.loading(`Approving ${tokenAName}...`, 0);
      try {
        const approveTxA = await tokenAContract.approve(poolContract.target, amountAWei);
        await approveTxA.wait();
        message.destroy();
        message.success(`${tokenAName} Approved！`);
      } catch (error) {
        message.destroy();
        message.error(`批准 ${tokenAName} 失败: ${error.message}`);
        setLoading(false);
        return;
      }

      message.loading(`Approving ${tokenBName}...`, 0);
      try {
        const approveTxB = await tokenBContract.approve(poolContract.target, amountBWei);
        await approveTxB.wait();
        message.destroy();
        message.success(`${tokenBName} Approved！`);
      } catch (error) {
        message.destroy();
        message.error(`批准 ${tokenBName} 失败: ${error.message}`);
        setLoading(false);
        return;
      }

      message.loading('Increasing liquidity...', 0);
      const tx = await poolContract.addLiquidity(
        isA ? amountAWei : amountBWei,
        isA ? amountBWei : amountAWei,
        minLpAmount
      );
      const receipt = await tx.wait();
      message.destroy();
      message.success('Liquidity added successfully!');

      // 解析交易回执，检查 LP 代币 Transfer 事件
      const lpTokenAddress = await poolContract.lpToken();
      const transferEvent = receipt.logs.find(
        log => log.address.toLowerCase() === lpTokenAddress.toLowerCase() &&
               log.topics[0] === ethers.id('Transfer(address,address,uint256)')
      );
      if (transferEvent) {
        const decoded = lpTokenContract.interface.parseLog(transferEvent);
        const lpAmount = ethers.formatUnits(decoded.args.value, 18);
        console.log(`检测到 LP 代币铸造: ${lpAmount} LP 至 ${decoded.args.to}`);
        if (decoded.args.to.toLowerCase() !== walletAddress.toLowerCase()) {
          console.error('LP 代币发送到错误地址:', decoded.args.to);
          message.warning('LP 代币可能未正确分配，请检查钱包地址');
        }
      } else {
        console.warn('未检测到 LP 代币 Transfer 事件，可能未铸造');
        message.warning('未检测到 LP 代币分配，请检查合约日志');
      }

      // 延迟 5 秒后多次尝试获取 LP 余额
      setTimeout(async () => {
        await fetchLpBalance();
        await fetchPoolInfo();
      }, 5000);

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

  const handleContinue = async () => {
    if (!tokenA || !tokenB || tokenA === tokenB) {
      message.error('请选择不同的代币');
      return;
    }

    if (tokenA === contracts.usdt.target) {
      setIsA(true);
    } else if (
      tokenA === contracts.dai.target &&
      (tokenB === contracts.shit.target || tokenB === contracts.eth.target)
    ) {
      setIsA(true);
    } else if (tokenA === contracts.shit.target && tokenB === contracts.eth.target) {
      setIsA(true);
    } else {
      setIsA(false);
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
    setRatio(null);
    setAmountA('');
    setAmountB('');
    setIsTokenSelected(false);
    setLpBalance('0');
    setPoolInfo({ reserveA: '0', reserveB: '0' });
  };

  const handleAmountAChange = async (e) => {
    const value = e.target.value;
    setAmountA(value);

    if (isTokenSelected && value && parseFloat(value) > 0) {
      try {
        const poolContract = getPoolContract();
        if (!poolContract) return;

        const amountInWei = ethers.parseUnits(value, 18);
        const pairedAmount = await poolContract.getPairedAmount(amountInWei, isA);
        const pairedAmountFormatted = ethers.formatUnits(pairedAmount, 18);
        setAmountB(pairedAmountFormatted);

        const ratio = parseFloat(pairedAmountFormatted) / parseFloat(value);
        setRatio(ratio);
      } catch (error) {
        console.error('获取配对金额失败:', error);
      }
    } else {
      setAmountB('');
    }
  };

  const handleAmountBChange = async (e) => {
    const value = e.target.value;
    setAmountB(value);

    if (isTokenSelected && value && parseFloat(value) > 0) {
      try {
        const poolContract = getPoolContract();
        if (!poolContract) return;

        const amountInWei = ethers.parseUnits(value, 18);
        const pairedAmount = await poolContract.getPairedAmount(amountInWei, !isA);
        const pairedAmountFormatted = ethers.formatUnits(pairedAmount, 18);
        setAmountA(pairedAmountFormatted);

        const newRatio = parseFloat(value) / parseFloat(pairedAmountFormatted);
        setRatio(newRatio);
      } catch (error) {
        console.error('获取配对金额失败:', error);
      }
    } else {
      setAmountA('');
    }
  };

  return (
    <Layout style={{ background: '#f5f7fa', minHeight: '100vh' }}>
      <Content style={{ padding: '24px' }}>
        <StyledCard title={<Text strong>Adding Liquidity</Text>}>
          <div style={{ marginBottom: '24px' }}>
            <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>Token A</Text>
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
                  placeholder="选择"
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
            <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>Token B</Text>
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
                  placeholder="选择"
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
              continue
            </Button>
          ) : (
            <>
              <Divider />
              <div style={{ marginBottom: '24px' }}>
                <Row justify="space-between" style={{ marginBottom: '8px' }}>
                  <Text type="secondary">Conversion Rate</Text>
                  <Text>
                    1 {supportedTokens.find((t) => t.address === tokenA)?.name} = {ratio ? ratio.toFixed(6) : '-'} {supportedTokens.find((t) => t.address === tokenB)?.name}
                  </Text>
                </Row>
                <Row justify="space-between" style={{ marginBottom: '8px' }}>
                  <Text type="secondary">Pool reserve</Text>
                  <Text>
                    {poolInfo.reserveA} {supportedTokens.find((t) => t.address === tokenA)?.name} / {poolInfo.reserveB} {supportedTokens.find((t) => t.address === tokenB)?.name}
                  </Text>
                </Row>
                <Row justify="space-between">
                  <Text type="secondary">Your LP token balance</Text>
                  <Text>{lpBalance} LP</Text>
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
                Adding Liquidity
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