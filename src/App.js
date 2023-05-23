import React from "react";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ConnectWallet } from "./components/wallet-connect";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";
import { Transfer } from "./components/transfer";
import Caver from "caver-js";
import Web3 from "web3";

const klayProvider = window["klaytn"];

function App() {
  const nftNetworkId = process.env.REACT_APP_NFT_NETWORK_ID;
  const kaikasNetwork = process.env.REACT_APP_KLATYN_NETWORK_ID;
  const web3 = new Web3(Web3.givenProvider || "http://localhost:3000");
  const caver = new Caver("https://api.baobab.klaytn.net:8651/");
  const { ethereum } = window;
  const klaytn = window.klaytn;

  // useState Hooks
  const [accountAddress, setAccountAddress] = useState(
    localStorage.getItem("accountAddress")
  );
  const [connectionType, setConnectionType] = useState(
    localStorage.getItem("connectionType")
  );
  const [isConnected, setIsConnected] = useState(
    localStorage.getItem("isConnected")
  );
  const [currentBalance, setCurrentBalance] = useState(
    localStorage.getItem("accountBalance")
  );

  // Connect To Kaikas
  const connectKaikaskWallet = async () => {
    try {
      if (klaytn.networkVersion !== kaikasNetwork) {
        klaytn.sendAsync(
          {
            method: "wallet_switchKlaytnChain",
            params: [
              {
                chainId: "0x3e9",
              },
            ],
          },
        );
      }
      let Walletaddress = (await klaytn.enable())[0];
      const balance = await caver.klay.getBalance(Walletaddress);
      setAccountAddress("Walletaddress");
      setConnectionType("Kaikas");
      setIsConnected(true);
      setCurrentBalance(balance * 10 ** -18);
      localStorage.setItem("accountBalance", balance * 10 ** -18);
      localStorage.setItem("accountAddress", Walletaddress);
      localStorage.setItem("isConnected", true);
      localStorage.setItem("connectionType", "Kaikas");
    } catch (error) {
      setAccountAddress("");
      setConnectionType("");
      setIsConnected(false);
      setCurrentBalance();
      localStorage.removeItem("accountAddress");
      localStorage.setItem("isConnected", false);
      localStorage.removeItem("connectionType");
      localStorage.removeItem("accountBalance");
      toast.error("kaikas Wallet Not Found", {
        theme: "colored",
      });
    }
  };
  connectionType === "Kaikas" &&
    klayProvider.on("accountsChanged", function (accounts) {
      connectKaikaskWallet();
    });

  // Connect To Metamask
  const connectMetamaskWallet = async () => {
    try {
      if (!ethereum) {
        toast.error("Metamask Wallet Not Found", {
          theme: "colored",
        });
      }
      const checkwalletnetwork = await window.ethereum.networkVersion;
      if (nftNetworkId !== checkwalletnetwork) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x5" }],
        });
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const balance = await web3.eth.getBalance(accounts[0]);
      setAccountAddress(accounts[0]);
      setConnectionType("Metamask");
      setIsConnected(true);
      setCurrentBalance(web3.utils.fromWei(balance, "ether"));
      localStorage.setItem(
        "accountBalance",
        web3.utils.fromWei(balance, "ether")
      );
      localStorage.setItem("accountAddress", accounts[0]);
      localStorage.setItem("isConnected", true);
      localStorage.setItem("connectionType", "Metamask");
    } catch (error) {
      setAccountAddress("");
      setConnectionType("");
      setIsConnected(false);
      setCurrentBalance();
      localStorage.removeItem("accountAddress");
      localStorage.setItem("isConnected", false);
      localStorage.removeItem("connectionType");
      localStorage.removeItem("accountBalance");
    }
  };
  connectionType === "Metamask" &&
    ethereum.on("accountsChanged", function (accounts) {
      connectMetamaskWallet();
    });

  return (
    <div className="app">
      {!isConnected ? (
        <ConnectWallet
          connectKaikaskWallet={() => connectKaikaskWallet()}
          connectMetamaskWallet={() => connectMetamaskWallet()}
        />
      ) : (
        <Transfer
          currentBalance={currentBalance}
          accountAddress={accountAddress}
          connectionType={connectionType}
          setAccountAddress={() => setAccountAddress()}
          setConnectionType={() => setConnectionType()}
          setIsConnected={() => setIsConnected()}
          setCurrentBalance={() => setCurrentBalance()}
        />
      )}

      <ToastContainer />
    </div>
  );
}

export default App;
