"use client";

import {useState} from 'react'
import { Abi, AbiFunction } from "abitype";
import { useDeployedContractInfo, useNetworkColor } from "~~/hooks/scaffold-eth";

import type { NextPage } from "next";
import { WriteOnlyFunctionForm } from "~~/app/debug/_components/contract";
import useWriteMyContract from './hooks'
import { parseEther } from 'viem'



type PageProps = {
  params: { tokenId: number };
};


// <ul className="steps steps-vertical lg:steps-horizontal">
//   <li className="step step-primary">Register</li>
//   <li className="step step-primary">Choose plan</li>
//   <li className="step">Purchase</li>
//   <li className="step">Receive Product</li>
// </ul>

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
  const [price, setPrice] = useState(0)
  console.log("9999", deployedContractData);

  const fn = {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "uri",
        type: "string",
      },
    ],
    name: "safeMint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  };
  return (
    <>
      <div className="text-center mt-8 bg-secondary p-10">
        <h1 className="text-4xl my-0">Debug Contracts</h1>
        <button
              className="btn btn-secondary"
              onClick={
                () => handleWrite([NFTMarketContractData.address, tokenId])
                }
              >Sell it!
        </button>

        <p className="text-neutral">
          You can debug & interact with your deployed contracts here.
          <br /> Check{" "}
          <code className="italic bg-base-300 text-base font-bold [word-spacing:-0.5rem] px-1">
            packages / nextjs / app / debug / page.tsx
          </code>{" "}
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

export default ListNFTPage;
