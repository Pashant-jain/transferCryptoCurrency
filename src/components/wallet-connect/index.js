import React from "react";
import "./connect-wallet.scss";

export const ConnectWallet = (props) => {
  return (
    <div className="connect_wallet_wrp">
      <h1>Connect Your Wallet</h1>
      <div className="wallet_list">
        <div
          className="wallet_card"
          onClick={() => props.connectMetamaskWallet()}
        >
          <figure>
            <img
              src="https://webllisto-nft.vercel.app/static/media/metamask_logo.f01b671f.svg"
              alt="metamask"
            />
          </figure>
          <h2>Meta Mask</h2>
        </div>
        <div
          className="wallet_card"
          onClick={() => props.connectKaikaskWallet()}
        >
          <figure>
            <img
              src="https://webllisto-nft.vercel.app/static/media/kaikas_logo.7160e581.svg"
              alt="Kaikas"
            />
          </figure>
          <h2>Kaikas</h2>
        </div>
      </div>
    </div>
  );
};
