import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 480px;
  margin: 40px auto;
  padding: 24px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  font-family: 'Inter', sans-serif;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
`;

const PrimaryButton = styled.button`
  flex: 1;
  padding: 14px 24px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #4338ca;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SecondaryButton = styled.button`
  flex: 1;
  padding: 14px 24px;
  background: white;
  color: #4f46e5;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f8fafc;
    border-color: #c7d2fe;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const StatsPanel = styled.div`
  margin-top: 24px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const StatItem = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const StatTitle = styled.div`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 4px;
`;

const StatValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
`;

const StatChange = styled.span`
  font-size: 14px;
  font-weight: 500;
  margin-left: 8px;
  color: ${(props) => (props.positive ? '#10b981' : '#ef4444')};
`;

const Action = ({ stats }) => {
  const navigate = useNavigate();

  const handleGoToSwapPage = () => {
    navigate('/');
  };

  const handleGoToLiquidityPage = () => {
    navigate('/liquidity');
  };

  return (
    <Container>
      {/* 按钮组 */}
      <ButtonGroup>
        <PrimaryButton onClick={handleGoToSwapPage}>Swap Tokens</PrimaryButton>
        <SecondaryButton onClick={handleGoToLiquidityPage}>Add Liquidity</SecondaryButton>
      </ButtonGroup>

      {/* 数据面板 */}
      <StatsPanel>
        <StatItem>
          <StatTitle>Pool balances</StatTitle>
          <StatValue>
            {stats.poolBalances.usdc} USDC <span style={{ color: '#4f46e5' }}>{stats.poolBalances.eth} ETH</span>
          </StatValue>
        </StatItem>
        <StatItem>
          <StatTitle>TVL</StatTitle>
          <StatValue>
            {stats.tvl} <StatChange positive={stats.tvlChange > 0}>{stats.tvlChange > 0 ? `+${stats.tvlChange}%` : `${stats.tvlChange}%`}</StatChange>
          </StatValue>
        </StatItem>
        <StatItem>
          <StatTitle>24H volume</StatTitle>
          <StatValue>
            {stats.volume} <StatChange positive={stats.volumeChange > 0}>{stats.volumeChange > 0 ? `+${stats.volumeChange}%` : `${stats.volumeChange}%`}</StatChange>
          </StatValue>
        </StatItem>
        <StatItem>
          <StatTitle>24H fees</StatTitle>
          <StatValue>{stats.fees}</StatValue>
        </StatItem>
      </StatsPanel>
    </Container>
  );
};

export default Action;