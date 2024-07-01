"use client";

import { useDeployedContractInfo, useNetworkColor } from "~~/hooks/scaffold-eth";

import TokenList from "~~/components/nft/TokenList";
import useNFTs from "./utils";
import Loading from '~~/components/Loading'


const NFTs = ({ deployedContractData }) => {
  const tokens = useNFTs({
    contractAddress: deployedContractData.address,
    abi: deployedContractData.abi,
  });


  if(tokens ===null) {
    return <Loading />
  }

  console.log(tokens,'tokens')
  return (
    <div>
      <h1>My NFTs</h1>
      <TokenList tokens={tokens} btnText="Sell Now"/>
    </div>
  );
};

const MyNFTsPage = () => {
  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo("ERC721Token");

  if (deployedContractLoading) {
    return <span className="loading loading-bars loading-lg"></span>
  }

  return (
    <div>
      <h1>My NFTs</h1>
      <NFTs deployedContractData={deployedContractData} />
    </div>
  );
};

export default MyNFTsPage;
