"use client";

import {useState} from 'react'
import { Abi, AbiFunction } from "abitype";
import { useDeployedContractInfo, useNetworkColor } from "~~/hooks/scaffold-eth";

import type { NextPage } from "next";
import { WriteOnlyFunctionForm } from "~~/app/debug/_components/contract";
import useWriteMyContract from './hooks'
import { parseEther } from 'viem'
import { Transaction } from 'viem';
import Success from '~~/components/nft/Success'



type PageProps = {
  params: { tokenId: number };
};


const Debug: NextPage = ({tokenId, deployedContractData, NFTMarketContractData}) => {
  const [handleWrite,txResult] = useWriteMyContract({
    contractAddress: deployedContractData.address,
    abi: deployedContractData.abi,
    functionName: 'approve'
  });
  const [handleListNFT,txNFTListResult] = useWriteMyContract({
    contractAddress: NFTMarketContractData.address,
    abi: NFTMarketContractData.abi,
    functionName: 'listNFT'
  });
  const [price, setPrice] = useState(0);

  return (
    <>
      <div className="text-center mt-8 bg-secondary p-10">
        {!txResult &&
        <>
        <h1 className="text-4xl my-0">Please approve this Transaction</h1>
        <button
              className="btn btn-secondary"
              onClick={
                () => handleWrite([NFTMarketContractData.address, tokenId])
                }
              >Sell it!
        </button>
        </>
        }
        {txResult && !txNFTListResult &&
        <>
        <p className="text-neutral">
          You can debug & interact with your deployed contracts here.
        </p>
        {deployedContractData && (
          <input type="text" placeholder="How much" className="input input-bordered w-full max-w-xs" onChange={
            (e)=>{
              setPrice(parseEther(e.target.value))
            }
          }/>
        )}
        <button className="btn btn-active btn-accent" onClick={
          ()=>handleListNFT([deployedContractData.address, tokenId, price])
        }>Submit</button>
        </>
      }
      {
        txNFTListResult && <Success />
      }
      </div>
    </>
  );
};

const ListNFTPage = ({ params }: PageProps) => {
  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo("ERC721Token");
  const { data: NFTMarketContractData, isLoading: deployedNFTMarketContractLoading } = useDeployedContractInfo("NFTMarket");
  const tokenId = params?.tokenId as string;

  if (deployedContractLoading || deployedNFTMarketContractLoading) {
    return <span className="loading loading-bars loading-lg"></span>;
  }

  console.log(deployedContractData, NFTMarketContractData)

  return <Debug tokenId={tokenId} deployedContractData={deployedContractData} NFTMarketContractData={NFTMarketContractData}/>
}

// seller
export default ListNFTPage;
