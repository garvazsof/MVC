import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/web3auth";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { ethers } from 'ethers';
import RPC from "./ethersRPC";
import "./App.css";
import contract from './contracts/Video721.json';
import logo from './elements/img/MVC_Logo.png'

const clientId = `${process.env.CLIENT_ID}`; // get from https://dashboard.web3auth.io
const contractAddress = "0x8ea11069484dA05d463946AFEDa9017503B30afA";
const abi = contract.abi;

function App() {

  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);
  const [uri, setUri] = useState<string | number | readonly string[] >('');

  useEffect(() => {

    const init = async () => {
      try {

        const web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x5",
            rpcTarget: "https://rpc.ankr.com/eth_goerli", // This is the public RPC we have added, please pass on your own endpoint while creating an app
          },
        });

        setWeb3auth(web3auth);

        await web3auth.initModal();
          if (web3auth.provider) {
            setProvider(web3auth.provider);
          };

      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    console.log("Now Connected 💥");
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    console.log(user);
  };

  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
  };

  const getChainId = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const chainId = await rpc.getChainId();
    console.log(chainId);
  };
  const getAccounts = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    console.log(address);
  };

  const getBalance = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    console.log(balance);
  };

  const sendTransaction = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const receipt = await rpc.sendTransaction();
    console.log(receipt);
  };

  const signMessage = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const signedMessage = await rpc.signMessage();
    console.log(signedMessage);
  };

  const getPrivateKey = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    console.log(privateKey);
  };

  // const checkWalletIsConnected = () => { }

  // const connectWalletHandler = () => { }

  // const connectWalletButton = () => {
  //   return (
  //     <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
  //       Connect Wallet
  //     </button>
  //   )
  // }

  // const mintNftButton = () => {
  //   return (
  //     <button onClick={mintNftHandler} className='cta-button mint-nft-button'>
  //       Mint NFT
  //     </button>
  //   )
  // }

  const handleChange = async (event: any) => {
    setUri(event.target.value);
    console.log(`Now the uri is: ${uri}`)
  }
  const mintNftHandler = async () => {

    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }

    console.log(`Now the uri is: ${uri}`)

    const rpc = new RPC(provider);

    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const signer = ethersProvider.getSigner();

    const nftContract = new ethers.Contract(contractAddress, abi, signer);

    console.log("Sending Minting Tx ‼");
    let nftTx = await nftContract.safeMint("0xD8532152a3F66bD590F29ce711C8ecCa5542325b", uri)

    console.log("Mining Tx");
    await nftTx.wait();

    console.log(`See Tx: https://goerli.etherscan.io/tx/${nftTx.hash}`);
 }

  const loggedInView = (
    <>
      {/* <button onClick={getUserInfo} className="card">
        Get User Info
      </button>
      <button onClick={getChainId} className="card">
        Get Chain ID
      </button>
      <button onClick={getAccounts} className="card">
        Get Accounts
      </button>
      <button onClick={getBalance} className="card">
        Get Balance
      </button>
      <button onClick={sendTransaction} className="card">
        Send Transaction
      </button>
      <button onClick={signMessage} className="card">
        Sign Message
      </button>
      <button onClick={getPrivateKey} className="card">
        Get Private Key
      </button> */}

      <div className="mintForm">
        <input type="text" value={uri} onChange={handleChange} />
      </div>

      <button onClick={mintNftHandler} className="card">
        Mint your video NFT
      </button>

      <button onClick={logout} className="card">
        Log Out
      </button>

      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </>
  );

  const unloggedInView = (
    <>
      <div className="card">
          <div className="splash">
              <p className="logo">
                <img src={logo}></img>
              </p>
          </div>
      </div>
      <button onClick={login} className="card">
        Login
      </button>
    </>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="#" rel="noreferrer">
          MVC App
        </a>
        | Empowering Creators
      </h1>

      <div className="grid">{provider ? loggedInView : unloggedInView}</div>

      <footer className="footer">
        <p>MVC empowers you</p>
      </footer>
    </div>
  );
}

export default App;