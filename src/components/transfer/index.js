import React from "react";
import "./transfer.scss";
import { useState } from "react";
import Web3 from "web3";
import Caver from "caver-js";
import { toast } from "react-toastify";
import { SpinnerCircular } from "spinners-react";

export const Transfer = (props) => {
  const caver = new Caver(window.klaytn);
  const web3 = new Web3(Web3.givenProvider || "http://localhost:3000");

  // useState Hooks
  const [walletAddressToError, setWalletAddressToError] = useState(" ");
  const [addresstoTransfer, setAddresstoTransfer] = useState("");
  const [amountError, setAmountError] = useState("");
  const [amount, setAmount] = useState();
  const [amountvalidate, setAmountvalidate] = useState(false);
  const [walletValidate, setWalletValidate] = useState(false);
  const [loading, setLoading] = useState(false);

  //validate Wallet Address
  const ValidateWallet = (e) => {
    const validAddress = Web3.utils.isAddress(e.target.value);
    if (
      e.target.value === "" ||
      e.target.value === null ||
      e.target.value === undefined
    ) {
      setWalletAddressToError("Wallet Address is Required");
      setWalletValidate(false);
    } else if (!validAddress) {
      setWalletAddressToError("Invalid Address");
      setWalletValidate(false);
    } else {
      setWalletAddressToError("");
      setAddresstoTransfer(e.target.value);
      setWalletValidate(true);
    }
  };

  // validate Amount
  const ValidateTransferAmount = (e) => {
    const transferAmount = e.target.value;
    setAmount(transferAmount);
    if (
      e.target.value === "" ||
      e.target.value === null ||
      e.target.value === undefined
    ) {
      setAmountError("");
      setAmountvalidate(false);
    } else if (transferAmount >= props.currentBalance) {
      setAmountError("Insufficient Balance");
      setAmountvalidate(false);
    } else {
      setAmountError("");
      setAmountvalidate(true);
    }
  };

  //transition Function
  const TransferAmount = () => {
    setLoading(true);
    if (walletValidate && amountvalidate) {
      if (props.connectionType === "Kaikas") {
        caver.klay
          .sendTransaction({
            type: "VALUE_TRANSFER",
            from: props.accountAddress,
            to: addresstoTransfer,
            value: caver.utils.toPeb(amount, "KLAY"),
            gas: 8000000,
          })
          .once("transactionHash", (transactionHash) => {
          })
          .once("receipt", (receipt) => {
            setLoading(false);
            setAmount();
            toast.success("Transition Success Succesfully", {
              theme: "colored",
            });
          })
          .once("error", (error) => {
            setLoading(false);
            toast.error("Transition Rejected", {
              theme: "colored",
            });
          });
      } else if (props.connectionType === "Metamask") {
        const TranferAmount = web3.utils.toWei(amount, "ether");
        web3.eth
          .sendTransaction({
            from: props.accountAddress,
            to: addresstoTransfer,
            value: TranferAmount,
          })
          .on("transactionHash", function (hash) {
            setLoading(false);
            setAmount("");
            toast.success("Transition Success Succesfully", {
              theme: "colored",
            });
          })
          .on("error", function (err) {
            setLoading(false);
            toast.error("Transition Rejected", {
              theme: "colored",
            });
          });
      }
    } else {
      setLoading(false);
      toast.error("Incorrect Transition Detail", {
        theme: "colored",
      });
    }
  };

  // disconnect Wallet
  const disconnectWallet = async () => {
    props.setAccountAddress("");
    props.setConnectionType("");
    props.setIsConnected(false);
    props.setCurrentBalance();
    localStorage.removeItem("accountAddress");
    localStorage.setItem("isConnected", false);
    localStorage.removeItem("connectionType");
    localStorage.removeItem("accountBalance");
  };

  return (
    <React.Fragment>
      {loading ? (
        <SpinnerCircular />
      ) : (
        <React.Fragment>
          <div className="transfer_wrp">
            <div className="form">
              <div className="form-group">
                <label htmlFor="walletAddress">To Wallet</label>
                <input
                  type="text"
                  className="form-control"
                  id="walletAddress"
                  name="walletAddress"
                  onChange={(e) => ValidateWallet(e)}
                  placeholder="Enter Wallet Adress"
                />
                <span
                  style={{
                    color: "red",
                    fontSize: 12,
                    fontWeight: "bold",
                    display: "block",
                  }}
                >
                  {walletAddressToError}
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="amount">Amout To Be Transfer</label>
                <input
                  type="number"
                  className="form-control"
                  id="amount"
                  name="amount"
                  onChange={(e) => ValidateTransferAmount(e)}
                  placeholder="Enter item Amount"
                  value={amount}
                />

                <span
                  style={{
                    color: "white",
                    fontSize: 12,
                    display: "block",
                  }}
                >
                  Current Balance:{" "}
                  {props.currentBalance > 0 ? props.currentBalance : 0}
                </span>
                <span
                  style={{
                    color: "red",
                    fontSize: 12,
                    fontWeight: "bold",
                    display: "block",
                  }}
                >
                  {amountError}
                </span>
              </div>
            </div>
            <div className="submit_wrp">
              <button type="submit" on onClick={() => TransferAmount()}>
                Transfer
              </button>
              <button onClick={() => disconnectWallet()}>Sign Out</button>
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
