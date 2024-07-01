import { useAccount, useReadContract } from "wagmi";
import {useEffect, useState} from 'react';

import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { readContract } from '@wagmi/core'

async function fetchIpfsData(url) {
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }
      const nftData = await response.json();
      return nftData;
  } catch (error) {
      console.error("Error fetching IPFS data:", error);
  }
}

export const getTokenData = async ({tokenId, contractAddress, abi,targetNetwork})=> {
  const result = await readContract(wagmiConfig, {
    address: contractAddress,
    functionName: "tokenURI",
    abi: abi,
    args: [tokenId],
    chainId: targetNetwork.id,
    query: {
      enabled: true,
      retry: false,
    },
  });
  
  const tokenData = await fetchIpfsData(result)
  return {
    ...tokenData,
    tokenId
  }
}



export const useNFT = ({ contractAddress, abi,deployedNFTContractData,args}) => {
  const { targetNetwork } = useTargetNetwork();
  const { address: connectedAddress } = useAccount();
  const {data: token, isFetching} = useReadContract({
    address: contractAddress,
    functionName: "getListing",
    abi: abi,
    chainId: targetNetwork.id,
    args,
    query: {
      enabled: true,
      retry: false,
    },
  });
  return [token, isFetching]
};



const useDetailTokens = ({tokens, nftContractAddress, abi, targetNetwork})=>{
  const [detailedTokens, setDetailedTokens] = useState([])
  useEffect(()=>{
    async function fetchTokens(tokens) {
      const newTokens = [];
      if(tokens?.length>0) {
        for(let t=0;t<tokens.length;t++) {
          const token = tokens[t];
          const tokenData = await getTokenData({
            tokenId: token.tokenId, contractAddress: nftContractAddress, abi,targetNetwork
          })
          newTokens.push({...token,...tokenData})
        }
      }
      setDetailedTokens(newTokens)
    }
    fetchTokens(tokens);
  }, [tokens])
  return detailedTokens;
}

const useNFTs = ({ contractAddress, abi,deployedNFTContractData }) => {
  const { targetNetwork } = useTargetNetwork();
  const { address: connectedAddress } = useAccount();
  const {data: tokens, isFetching} = useReadContract({
    address: contractAddress,
    functionName: "getListings",
    abi: abi,
    chainId: targetNetwork.id,
    query: {
      enabled: true,
      retry: false,
    },
  });
  const newTokens = useDetailTokens({tokens, nftContractAddress:deployedNFTContractData.address ,abi:deployedNFTContractData.abi, targetNetwork})

  console.log(tokens, 'tokens',isFetching)
  
  return [newTokens, isFetching]
};



export default useNFTs;
