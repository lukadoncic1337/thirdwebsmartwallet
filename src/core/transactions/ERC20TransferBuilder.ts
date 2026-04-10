import { encodeFunctionData, parseUnits } from 'viem';
import { TransactionError } from '../../shared/errors';

const erc20TransferAbi = [
  {
    name: 'transfer',
    type: 'function',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const;

export async function sendERC20Transfer(
  smartAccountClient: any,
  tokenAddress: string,
  to: string,
  amount: string,
  decimals: number
): Promise<string> {
  try {
    const data = encodeFunctionData({
      abi: erc20TransferAbi,
      functionName: 'transfer',
      args: [to as `0x${string}`, parseUnits(amount, decimals)],
    });

    const txHash = await smartAccountClient.sendTransaction({
      to: tokenAddress as `0x${string}`,
      value: 0n,
      data,
    });

    return txHash;
  } catch (error) {
    throw new TransactionError(
      `ERC-20 transfer failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
