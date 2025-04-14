import { useState, useCallback, useEffect } from 'react';
import { baseSepolia } from 'viem/chains';

// Define window ethereum type
declare global {
  interface Window {
    ethereum?: any;
  }
}

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_AGENT_DEPLOYMENT_CONTRACT || '';

export const agentDeploymentABI = [
  {
    inputs: [],
    name: 'payDeploymentFee',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'checkPaymentStatus',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'deploymentFee',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// ABI encoding helpers
const encodeCheckPaymentStatus = (address: string) => {
  // Function signature: checkPaymentStatus(address)
  // keccak256("checkPaymentStatus(address)") = 0x5a8386a2...
  const functionSelector = '0x5a8386a2';
  const encodedAddress = address.slice(2).padStart(64, '0');
  return `${functionSelector}${encodedAddress}`;
};

const encodeDeploymentFee = () => {
  // Function signature: deploymentFee()
  // keccak256("deploymentFee()") = 0x64b0e37e...
  return '0x64b0e37e';
};

const encodePayDeploymentFee = () => {
  // Function signature: payDeploymentFee()
  // keccak256("payDeploymentFee()") = 0x50d3cf63...
  return '0x50d3cf63';
};

export function useAgentDeployment() {
  const [account, setAccount] = useState<`0x${string}` | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);

  // Initialize client-side only code after mount
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (!isBrowser) return;
    
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setAccount(null);
      } else {
        setAccount(accounts[0] as `0x${string}`);
      }
    };

    // Check if already connected
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          handleAccountsChanged(accounts);
        } catch (err) {
          console.error('Error checking wallet connection:', err);
        }
      }
    };

    checkConnection();

    // Set up event listeners
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [isBrowser]);

  // Check if the user has already paid
  const checkPaymentStatus = useCallback(async () => {
    if (!account || !isBrowser || typeof window === 'undefined' || !window.ethereum) return false;
    
    try {
      // Use eth_call to call the checkPaymentStatus function
      const data = encodeCheckPaymentStatus(account);
      
      const result = await window.ethereum.request({
        method: 'eth_call',
        params: [
          {
            to: CONTRACT_ADDRESS,
            data: data,
          },
          'latest',
        ],
      });
      
      // Result will be a hex string, convert to boolean
      const status = result === '0x0000000000000000000000000000000000000000000000000000000000000001';
      setIsPaid(status);
      return status;
    } catch (error) {
      console.error('Error checking payment status:', error);
      return false;
    }
  }, [account, isBrowser]);

  // Effect to check payment status when account changes
  useEffect(() => {
    if (account && isBrowser) {
      checkPaymentStatus();
    }
  }, [account, checkPaymentStatus, isBrowser]);

  // Switch to Base Sepolia network
  const switchToBaseSepolia = async () => {
    if (typeof window === 'undefined' || !window.ethereum || !isBrowser) return false;

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
          return false;
        }
      }
      console.error('Error switching to Base Sepolia network:', switchError);
      return false;
    }
  };

  // Pay the deployment fee
  const payDeploymentFee = useCallback(async () => {
    if (!account || !isBrowser || typeof window === 'undefined' || !window.ethereum) {
      throw new Error('No wallet connected');
    }
    
    setIsLoading(true);

    try {
      // Switch to Base Sepolia
      const switched = await switchToBaseSepolia();
      if (!switched) {
        throw new Error('Failed to switch to Base Sepolia network');
      }

      // Get the deployment fee
      const feeHex = await window.ethereum.request({
        method: 'eth_call',
        params: [
          {
            to: CONTRACT_ADDRESS,
            data: encodeDeploymentFee(),
          },
          'latest',
        ],
      });
      
      // Fee is returned as a hex string
      const fee = feeHex;

      // Send the transaction
      const transactionHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: account,
            to: CONTRACT_ADDRESS,
            value: fee,
            data: encodePayDeploymentFee(),
          },
        ],
      });

      console.log('Transaction hash:', transactionHash);
      
      // Wait for transaction confirmation by polling
      let confirmed = false;
      while (!confirmed) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Poll every 2 seconds
        
        const receipt = await window.ethereum.request({
          method: 'eth_getTransactionReceipt',
          params: [transactionHash],
        });
        
        if (receipt && receipt.blockNumber) {
          confirmed = true;
          console.log('Transaction confirmed in block:', parseInt(receipt.blockNumber, 16));
        }
      }
      
      // Once confirmed, update the payment status
      setIsPaid(true);
      return transactionHash;
    } catch (error) {
      console.error('Error paying deployment fee:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [account, isBrowser, switchToBaseSepolia]);

  return {
    account,
    isPaid,
    isLoading,
    payDeploymentFee,
    checkPaymentStatus,
    isBrowser,
  };
}
