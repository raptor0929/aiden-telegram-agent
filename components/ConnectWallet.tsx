"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { WalletIcon, LogOut } from 'lucide-react';
import { baseSepolia } from 'viem/chains';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Properly define Ethereum provider interface
interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (...args: any[]) => void) => void;
  removeListener: (event: string, callback: (...args: any[]) => void) => void;
  isMetaMask?: boolean;
  isPhantom?: boolean;
  disconnect?: () => Promise<void>;
}

// // Extend Window interface to include ethereum property
// declare global {
//   interface Window {
//     ethereum?: EthereumProvider;
//   }
// }

const ConnectWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [chainId, setChainId] = useState<string | null>(null);

  // Only show the component after it's mounted on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Function to handle account changes (wrapped in useCallback to avoid stale closures)
  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length === 0) {
      setAccount(null);
    } else {
      setAccount(accounts[0]);
    }
  }, []);

  // Change this function
  const handleChainChanged = useCallback((chainIdHex: string) => {
    setChainId(chainIdHex);
    // Do NOT reload the page automatically
    if (parseInt(chainIdHex, 16) !== baseSepolia.id) {
      setError(`Please switch to Base Sepolia network (Chain ID: ${baseSepolia.id})`);
    } else {
      setError(null);
    }
  }, []);

  // Check if wallet is already connected on component mount
  useEffect(() => {
    if (!mounted) return;

    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          handleAccountsChanged(accounts);
          
          // Also check current chain
          const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
          handleChainChanged(chainIdHex);
        } catch (err) {
          console.error('Error checking connection:', err);
        }
      }
    };

    checkConnection();

    return () => {}; // Cleanup function
  }, [mounted, handleAccountsChanged, handleChainChanged]);

  // Set up event listeners for account and chain changes
  useEffect(() => {
    if (!mounted || !window.ethereum) return;

    // Add event listeners
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    // Clean up event listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [mounted, handleAccountsChanged, handleChainChanged]);

  // Function to switch to Base Sepolia network
  const switchToBaseSepolia = async () => {
    if (!window.ethereum) return false;

    try {
      // Try to switch to the Base Sepolia network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${baseSepolia.id.toString(16)}` }],
      });
      return true;
    } catch (switchError: any) {
      // If the error code is 4902, the chain is not added to the wallet
      if (switchError.code === 4902) {
        try {
          // Add the Base Sepolia network to the wallet
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${baseSepolia.id.toString(16)}`,
                chainName: 'Base Sepolia Testnet',
                nativeCurrency: {
                  name: 'Sepolia ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia.base.org'],
                blockExplorerUrls: ['https://sepolia.basescan.org'],
              },
            ],
          });
          return true;
        } catch (addError) {
          console.error('Error adding Base Sepolia network:', addError);
          setError('Unable to add Base Sepolia network to your wallet. Please add it manually.');
          return false;
        }
      }
      console.error('Error switching to Base Sepolia network:', switchError);
      setError('Failed to switch to Base Sepolia network. Please switch manually in your wallet.');
      return false;
    }
  };

  // Function to connect wallet
  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('No Ethereum wallet detected. Please install Phantom, MetaMask, or another compatible wallet extension.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Switched to Base Sepolia
      const switched = await switchToBaseSepolia();
      if (!switched) {
        // Error is already set in switchToBaseSepolia
        setIsConnecting(false);
        return;
      }
      
      handleAccountsChanged(accounts);
    } catch (err: any) {
      console.error('Error connecting wallet:', err);
      if (err.code === 4001) {
        setError('Connection rejected by user. Please try again.');
      } else {
        setError(err.message || 'Failed to connect wallet. Please try again later.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Function to disconnect wallet - improved with better handling for different wallets
  const disconnectWallet = async () => {
    // Clear our application state regardless of the wallet's disconnect capability
    setAccount(null);
    
    // Try to use wallet's native disconnect method if available
    if (window.ethereum && window.ethereum.disconnect) {
      try {
        await window.ethereum.disconnect();
        console.log('Wallet disconnected via provider method');
      } catch (err) {
        console.error('Error using wallet disconnect method:', err);
      }
    } else {
      console.log('Wallet disconnected at application level only');
      // For wallets without disconnect method, show info to the user
      setError('Your wallet remains connected at the browser level. To fully disconnect, please use your wallet extension.');
      // Auto-clear the message after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  };

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Don't render anything on server or during initial client hydration
  if (!mounted) {
    return <Button variant="outline" className="opacity-0">Loading...</Button>;
  }

  return (
    <div>
      {!account ? (
        <Button 
          onClick={connectWallet} 
          disabled={isConnecting}
          className="flex items-center gap-2"
        >
          <WalletIcon className="h-4 w-4" />
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <WalletIcon className="h-4 w-4" />
              {formatAddress(account)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={disconnectWallet}
              className="flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {error && (
        <p className="text-red-500 text-sm mt-2 max-w-xs">{error}</p>
      )}
    </div>
  );
};

export default ConnectWallet;