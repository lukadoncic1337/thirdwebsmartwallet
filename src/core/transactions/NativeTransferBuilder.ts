import { parseEther } from 'viem';
import { TransactionError } from '../../shared/errors';

export async function sendNativeTransfer(
  smartAccountClient: any,
  to: string,
  amountEth: string
): Promise<string> {
  try {
    const txHash = await smartAccountClient.sendTransaction({
      to: to as `0x${string}`,
      value: parseEther(amountEth),
      data: '0x' as const,
    });
    return txHash;
  } catch (error) {
    throw new TransactionError(
      `Native transfer failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
