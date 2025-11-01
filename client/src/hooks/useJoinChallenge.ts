import { useState } from 'react';
import { Alert } from 'react-native';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, Connection, clusterApiUrl } from '@solana/web3.js';
import { useMobileWallet } from '../utils/useMobileWallet';
import { useAuthorization } from '../utils/useAuthorization';

// Demo wallet to receive challenge entry fees
const CHALLENGE_WALLET = new PublicKey('9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM');

// Solana connection
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

export function useJoinChallenge() {
  const [isJoining, setIsJoining] = useState(false);
  const { selectedAccount } = useAuthorization();
  const { signAndSendTransaction } = useMobileWallet();

  const joinChallenge = async (challengeId: string, entryFee: string): Promise<boolean> => {
    if (!selectedAccount) {
      Alert.alert('Error', 'Please connect your wallet first');
      return false;
    }

    setIsJoining(true);

    try {
      // Parse entry fee (e.g., "0.5 SOL" -> 0.5)
      const feeAmount = parseFloat(entryFee.replace(' SOL', ''));
      const lamports = feeAmount * LAMPORTS_PER_SOL;

      const latestBlockhash = await connection.getLatestBlockhash('finalized');
      const slot = await connection.getSlot('finalized');

      const transaction = new Transaction({
        feePayer: selectedAccount.publicKey,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      });
      
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: selectedAccount.publicKey,
          toPubkey: CHALLENGE_WALLET,
          lamports: lamports,
        })
      );

      const signature = await signAndSendTransaction(transaction, slot);
      
      Alert.alert(
        'Success! 🎉',
        `You've joined the challenge!\n\nTransaction: ${signature.slice(0, 8)}...${signature.slice(-8)}`,
        [{ text: 'OK' }]
      );

      setIsJoining(false);
      return true;
    } catch (error: any) {
      
      // Check if user cancelled
      if (error.message?.includes('User declined') || error.message?.includes('cancelled')) {
        Alert.alert('Cancelled', 'You cancelled the transaction');
      } else {
        Alert.alert('Error', `Failed to join challenge: ${error.message || 'Unknown error'}`);
      }
      
      setIsJoining(false);
      return false;
    }
  };

  return {
    joinChallenge,
    isJoining,
  };
}

