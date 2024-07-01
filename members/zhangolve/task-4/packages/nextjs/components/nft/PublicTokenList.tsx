import Image from 'next/image';
import Link from "next/link";
import React from 'react';
import BlankTokenList from './BlankTokenList';

const SquareImageList = ({ tokens }) => {
  console.log('9999')
  console.log(tokens,'tokens')
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {tokens.map((token, index) => (
        <>
            <div className="card bg-base-100 w-96 shadow-xl">
              <figure className="px-10 pt-10">
                <img src={token.image} alt={token.name} className="rounded-xl" />
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">{token.name}</h2>
                <p>{token.description}</p>
                <div className="card-actions">
                  <button className="btn btn-primary">
                    <Link href={`/listnft/${token.tokenId}`}>            
                      Buy Now
                    </Link>
                    </button>
                </div>
              </div>
            </div>
        </>
      ))}
      {
        tokens.length===0 && <BlankTokenList/>
      }
    </div>
  );
}

export default SquareImageList;
