import deployedContracts from './deployed_contracts.json';

// 代币地址
export const usdtAddress = deployedContracts.tokens.USDT;
export const daiAddress = deployedContracts.tokens.DAI;
export const shitAddress = deployedContracts.tokens.SHIT;
export const ethAddress = deployedContracts.tokens.wETH;

// LP代币地址
export const usdtDaiLpTokenAddress = deployedContracts.lpTokens.USDT_DAI;
export const usdtEthLpTokenAddress = deployedContracts.lpTokens.USDT_wETH;
export const usdtShitLpTokenAddress = deployedContracts.lpTokens.USDT_SHIT;
export const daiEthLpTokenAddress = deployedContracts.lpTokens.DAI_wETH;
export const shitEthLpTokenAddress = deployedContracts.lpTokens.SHIT_wETH;
export const daiShitLpTokenAddress = deployedContracts.lpTokens.DAI_SHIT;

// 池子合约地址
export const usdtDaiPoolAddress = deployedContracts.swapPools.USDT_DAI;
export const usdtEthPoolAddress = deployedContracts.swapPools.USDT_wETH;
export const usdtShitPoolAddress = deployedContracts.swapPools.USDT_SHIT;
export const daiEthPoolAddress = deployedContracts.swapPools.DAI_wETH;
export const shitEthPoolAddress = deployedContracts.swapPools.SHIT_wETH;
export const daiShitPoolAddress = deployedContracts.swapPools.DAI_SHIT;