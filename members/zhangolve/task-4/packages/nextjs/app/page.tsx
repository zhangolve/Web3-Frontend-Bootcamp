"use client";

import { useDeployedContractInfo, useNetworkColor } from "~~/hooks/scaffold-eth";

import TokenList from "~~/components/nft/TokenList";
import useNFTs from "./utils";

const NFTs = ({ deployedContractData, deployedNFTContractData }) => {
  const [tokens, loading] = useNFTs({
    contractAddress: deployedContractData.address,
    abi: deployedContractData.abi,
    deployedNFTContractData: deployedNFTContractData
  });



  if(tokens ===undefined) {
    return <span className="loading loading-bars loading-lg"></span>;
  }

  return (
    <div>
      <h1>My NFTs</h1>
      <TokenList tokens={tokens} btnText="Buy Now"/>
    </div>
  );
};

const MyNFTsPage = () => {
  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo("NFTMarket");
  const { data: deployedNFTContractData, isLoading: deployedNFTContractLoading } = useDeployedContractInfo("ERC721Token");

  if (deployedContractLoading || deployedNFTContractLoading) {
    return <span className="loading loading-bars loading-lg"></span>
  }

  return (
    <div>
      <h1>This is my NFT Market , you need to pay olive token to buy NFT</h1>
      <NFTs deployedContractData={deployedContractData} deployedNFTContractData={deployedNFTContractData}/>
    </div>
  );
};

export default MyNFTsPage;