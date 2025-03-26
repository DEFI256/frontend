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

const Title = styled.h1`
  color: #2d3748;
  font-size: 24px;
  margin-bottom: 32px;
  font-weight: 600;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
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

const Pool = () => {
  const navigate = useNavigate();

  const handleGoToSwapPage = () => {
    navigate('/SwapPage');
  };

  const handleGoToLiquidityPage = () => {
    navigate('/Liquidity');
  };

  return (
    <Container>
      <Title>Pool</Title>
      
      <ButtonGroup>
        <PrimaryButton onClick={handleGoToSwapPage}>
          Swap Tokens
        </PrimaryButton>
        <SecondaryButton onClick={handleGoToLiquidityPage}>
          Add Liquidity
        </SecondaryButton>
      </ButtonGroup>
    </Container>
  );
};

export default Pool;