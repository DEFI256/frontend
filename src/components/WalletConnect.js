import React from 'react';
import { Button } from 'antd';
import { useWallet } from '../contexts/WalletContext';

function WalletConnect({ onWalletConnected }) {
  const { walletAddress, isConnected, connectWallet, formatAddress } = useWallet();

  const handleConnect = async () => {
    const connected = await connectWallet();
    if (connected && onWalletConnected) {
      onWalletConnected(true);
    }
  };

  return (
    <div>
    {!isConnected ? (
      <Button 
        type="primary"
        style={{ backgroundColor: '#FFD700', borderColor: '#FFD700' }}
        onClick={handleConnect}
      >
        Connect Wallet
      </Button>
    ) : (
      <Button
        style={{ backgroundColor: '#FFD700', borderColor: '#FFD700', color: '#000' }}
        onClick={() => onWalletConnected(true)}
      >
        {formatAddress(walletAddress)}
      </Button>
    )}
  </div>
  );
}

export default WalletConnect;