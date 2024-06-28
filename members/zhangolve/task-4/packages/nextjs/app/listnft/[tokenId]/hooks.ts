import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import { useTransactor } from "~~/hooks/scaffold-eth";

const useWriteMyContract = ({ contractAddress, abi, functionName })=>{
    const { data: result, isPending, writeContractAsync } = useWriteContract();
    const writeTxn = useTransactor();
    const handleWrite = async (args) => {
        if (writeContractAsync) {
        try {
            const makeWriteWithParams = () =>
            writeContractAsync({
                address: contractAddress,
                functionName,
                abi: abi,
                args,
                // value: BigInt(txValue),
            });
            await writeTxn(makeWriteWithParams);
        } catch (e: any) {
            console.error("⚡️ ~ file: WriteOnlyFunctionForm.tsx:handleWrite ~ error", e);
        }
        }
    };

    const { data: txResult } = useWaitForTransactionReceipt({
        hash: result,
    });

    return [handleWrite,txResult];
}

export default useWriteMyContract;