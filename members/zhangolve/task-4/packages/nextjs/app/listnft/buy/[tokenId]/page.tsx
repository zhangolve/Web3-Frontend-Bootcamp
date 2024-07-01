"use client";

import {useState} from 'react'
import { Abi, AbiFunction } from "abitype";
import { useDeployedContractInfo, useNetworkColor } from "~~/hooks/scaffold-eth";

import type { NextPage } from "next";
import { WriteOnlyFunctionForm } from "~~/app/debug/_components/contract";
// import useWriteMyContract from './hooks'
import { parseEther } from 'viem'
import { Transaction } from 'viem';
import Success from '~~/components/nft/Success'
import {useNFT} from '../utils';


type PageProps = {
  params: { tokenId: number };
};


const Debug: NextPage = ({listId, deployedContractData, NFTMarketContractData}) => {
  
  const [token, isFetching] = useNFT({
    contractAddress: NFTMarketContractData.address, 
    abi: NFTMarketContractData.abi,
    deployedNFTContractData:deployedContractData ,
    args: [listId]
  })



  return (
    <>
    
    </>
  );
};

const ListNFTPage = ({ params }: PageProps) => {
  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo("ERC721Token");
  const { data: NFTMarketContractData, isLoading: deployedNFTMarketContractLoading } = useDeployedContractInfo("NFTMarket");
  const listId = params?.listId as string;

  if (deployedContractLoading || deployedNFTMarketContractLoading) {
    return <span className="loading loading-bars loading-lg"></span>;
  }

  console.log(deployedContractData, NFTMarketContractData)

  return <Debug listId={listId} deployedContractData={deployedContractData} NFTMarketContractData={NFTMarketContractData}/>
}

// seller
export default ListNFTPage;
