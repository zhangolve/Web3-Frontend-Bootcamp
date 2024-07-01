import { useAccount, useReadContract } from "wagmi";
import {useEffect, useState} from 'react';

import { readContract } from '@wagmi/core'
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import {getTokenData} from '../utils'


// async function displayNftImage(ipfsUrl:string) {
//   const nftData = await fetchIpfsData(ipfsUrl);
//   if (!nftData) {
//       return;
//   }

//   const imageUrl = nftData.image;

//   // 如果 image 字段是 ipfs:// 开头，替换为 https://ipfs.io/ipfs/
//   if (imageUrl.startsWith("ipfs://")) {
//       const ipfsImageHash = imageUrl.replace("ipfs://", "");
//       return  `https://ipfs.io/ipfs/${ipfsImageHash}`;
//   } else {
//     return imageUrl;
//   }
// }

const useNFTs = ({ contractAddress, abi }) => {
  const { targetNetwork } = useTargetNetwork();
  const { address: connectedAddress } = useAccount();
  const [tokens, setTokens] = useState(null)

  // const { isFetching, refetch, error, data }//
  const {data: balance, isFetching: balanceIsFetching} = useReadContract({
    address: contractAddress,
    functionName: "balanceOf",
    abi: abi,
    args: [connectedAddress],
    chainId: targetNetwork.id,
    query: {
      enabled: true,
      retry: false,
    },
  });
  console.log(balance,'ba')
  
  useEffect(()=>{
    if(balance) {
      async function fetchTokens() {
      const tokens = [];
      for(var i=0;i<balance;i++) {
        // const {data: tokenId, status }
        const tokenId = await readContract(wagmiConfig, {
          address: contractAddress,
          functionName: "tokenOfOwnerByIndex",
          abi: abi,
          args: [connectedAddress, i],
          chainId: targetNetwork.id,
          query: {
            enabled: true,
            retry: false,
          },
        });

        const tokenData = await getTokenData({
          abi, targetNetwork, contractAddress, tokenId
        })
        tokens.push({
          ...tokenData,
          tokenId
        })
        // console.log(status, error, 'status')
        // console.log(tokenId, 'tokenid')
        // if(tokenId) {
        //   tokens.push(tokenId)
        // }
      }
      setTokens(tokens)
      console.log(tokens,'tokens');
    }
    fetchTokens();
    } else {
      setTokens([])
    }
  }, [balance])

  console.log(connectedAddress,'connectedAddress')
  // console.log(result,'result');
  return tokens
};




export default useNFTs;
