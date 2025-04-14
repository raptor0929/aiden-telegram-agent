import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';

// Define window ethereum type
declare global {
  interface Window {
    ethereum?: any;
  }
}

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_AGENT_DEPLOYMENT_CONTRACT || '';
const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS || '';

// Simple ABI definitions
const AGENT_DEPLOYMENT_ABI = [
  'function payDeploymentFee()',
  'function checkPaymentStatus(address _user) view returns (bool)',
  'function deploymentFee() view returns (uint256)',
  'function token() view returns (address)'
];

const ERC20_ABI = [
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)'
];

export function useAgentDeployment() {
  const [account, setAccount] = useState<string | null>(null);
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
        setAccount(accounts[0]);
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
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, AGENT_DEPLOYMENT_ABI, provider);
      
      const status = await contract.checkPaymentStatus(account);
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

    // Base Sepolia chain ID
    const baseSepolia = {
      id: 84532,
      name: 'Base Sepolia Testnet',
    };

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

      // Create ethers provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Create contract instances
      const deploymentContract = new ethers.Contract(CONTRACT_ADDRESS, AGENT_DEPLOYMENT_ABI, signer);
      
      // Get token address
      let tokenAddress = TOKEN_ADDRESS;
      if (!tokenAddress) {
        tokenAddress = await deploymentContract.token();
      }
      
      // Create token contract instance
      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);

      // Get the deployment fee
      const fee = await deploymentContract.deploymentFee();
      
      // Check current allowance
      const allowance = await tokenContract.allowance(account, CONTRACT_ADDRESS);
      
      // If allowance is less than fee, approve first
      if (allowance < fee) {
        console.log('Approving token spend...');
        const approveTx = await tokenContract.approve(CONTRACT_ADDRESS, fee);
        console.log('Approve transaction hash:', approveTx.hash);
        
        // Wait for confirmation
        const approveReceipt = await approveTx.wait();
        console.log('Approval confirmed in block:', approveReceipt?.blockNumber);
      }

      // Send the transaction to pay deployment fee
      console.log('Paying deployment fee...');
      const tx = await deploymentContract.payDeploymentFee();
      console.log('Transaction hash:', tx.hash);
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed in block:', receipt?.blockNumber);
      
      // Once confirmed, update the payment status
      setIsPaid(true);
      return tx.hash;
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
