import React, {  useState, useEffect } from 'react'
import styled from 'styled-components';
import Web3 from 'web3';
import SmartTokens from './SmartTokens.json';
import {ipfsClient} from '../ipfs/ipfsApi.js';


//https://carbon-credit-carbon-br.infura-ipfs.io/ipfs/QmS4LZ3AMQusfd5y7hzx6vxZKGgnvsDLTjsxBFNH3H7MFk


const Section = styled.section`
min-height: 40vh; 
width: 100vw;
background-color: #54c286;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
position: relative;
overflow: hidden;
`
const Form = styled.form`
  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
  }

  label {
    font-weight: bold;
  }

  input {
    padding: 5px;
  }
`;
const Showcase = () => { 
  const [contractOwner, setContractOwner] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contractInstance, setContractInstance] = useState('null');
  const [owner, setOwner] = useState('');  
  // const [account, setAccount] = useState('');
  const [CCT, setCCT] = useState(0); // Quantidade de Tokens
  const [projectName, setProjectName] = useState('');
  const [startDate, setStartDate] = useState(0);
  const [endDate, setEndDate] = useState(0);
  const [loading, setLoading] = useState(false);
              /////// Ipfs Upload
  const [ipfsHash, setIpfsHash] = useState(null);
/*
//função para testar o ipfs do infura
async function ipfs() {
     let ipfs = await ipfsClient()
   
  let result = await ipfs.add(`Contrato Carbono numero da SmartC02 criando em ${new Date()}`);
   console.log(result);
   console.log(arguments);
 }

 ipfs();*/


 
  
 useEffect(() => {
  // O Web3 Dentro do componente useEffect para obter a instância do contrato:
  if (window.ethereum) {
    const web3  = new Web3(window.ethereum);
    setWeb3();

    // Solicite acesso à conta do usuário
    window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(accounts => {
        setOwner(accounts[0]);
        
      })
      .catch(error => {
        console.error(error);
      });


   
   // Obtenha o endereço do dono do contrato
    web3.eth.getAccounts().then(accounts => {
    const networkID  ='97'; //trocar para 5777 de for usa o Ganache
    const networkData = SmartTokens.networks[networkID];
    const contractAddress = networkData.address; // Substitua pelo contract address Truffle netwoerk local SmartTokens: 0x4aFdd4798c08B7bAA0b2D54Bd9CD57CEcC4C09ab
    
    console.log('Contract Adress: ', contractAddress);
    setContractInstance(contractAddress);
    console.log('Contract Intance: ', contractInstance);
    //console.log('SmartTokens.abi', SmartTokens.abi);
    const smartContract = new web3.eth.Contract(SmartTokens.abi, contractAddress);
   
    smartContract.methods.owner().call() //send envia dados para blockchai, call chama informação.
      .then(ownerAddress => {
        setContractOwner(ownerAddress);
      })
      .catch(error => {
        console.error('Erro ao obter o endereço do dono do contrato:', error);
      });

   }); 
  }
}, []);


    ///--------------------------
    /// Functions of ipfsUpload 
    ///-------------------------- 
    
    function captureFile(e) {
      return new Promise((resolve, reject) => {
        e.preventDefault();
        const file = e.target.files[0];
    
        const reader = new window.FileReader();
    
        reader.onloadend = () => {
          const buffer = new Uint8Array(reader.result);
          setIpfsHash(buffer)
          console.log('=== buffer Ok ===', buffer);
          resolve(buffer);
        };
    
        reader.onerror = (error) => {
          console.error('Erro ao ler arquivo:', error);
          reject(error);
        };
    
        if (file) {
          reader.readAsArrayBuffer(file); // Read bufffered file
        } else {
          reject(new Error('Nenhum arquivo selecionado.'));
        }
      });
    }


//Função para lidar com o envio do formulário e chamar a função mint do contrato inteligente:
const handleMint = async (e) => {
  e.preventDefault();

  const ipfs = await ipfsClient();
  
  ipfs.add(ipfsHash).then(result => {
    // In case of fail to upload to IPFS
      const hash = result.path;
     console.log('Ipfs ok result', hash);
  
  try {
   setLoading(true);
   
    if (window.ethereum) {
      const web3  = new Web3(window.ethereum);


       // Obtenha informações dos Tokens criados
       web3.eth.getAccounts().then(async accounts => {
        const networkID  ='97'; //trocar para 5777 de for usa o Ganache
        const networkData = SmartTokens.networks[networkID];
        const contractAddress = networkData.address; // Substitua pelo contract address Truffle netwoerk local SmartTokens: 0x4aFdd4798c08B7bAA0b2D54Bd9CD57CEcC4C09ab
        console.log('contractAddress Informações da criaçao do token::', contractAddress);            
        const smartContract = new web3.eth.Contract(SmartTokens.abi,contractAddress);       

     // Chame a função mint
    const gasLimit =  web3.utils.toWei(0.00143629, 'gwei');
    const gasPrice = await web3.eth.getGasPrice(); 

    console.log('Info instancia smartContract:', smartContract);     
    console.log('owner mint', owner);     
    console.log('gasPrice: ',gasPrice);
    console.log('gas', gasLimit);
    console.log(typeof CCT);
    
    const tx = await smartContract.methods.mint(CCT,projectName,startDate,endDate,hash )
                  .send({ from: owner, gas: gasLimit, gasPrice: gasPrice });

  console.log('Transação concluída:', tx);
  console.log('Transaction Hash:', tx.transactionHash);    
    
      // Limpe os campos do formulário
      setCCT(0);
      setProjectName('');
      setStartDate(0);
      setEndDate(0);
      setIpfsHash(null);
  
       }); 
      }  
  
  } catch (error) {
    console.error('Erro ao chamar a função mint:', error);
  } finally {
    setLoading(false);
  }
}).catch(error => {
  console.log("Erro aqui")  
  console.error(`erro aqui:${error}`)

});

};

useEffect(() => {
  // O Web3 Dentro do componente useEffect para obter a instância do contrato:
  if (window.ethereum) {
    const web3  = new Web3(window.ethereum);

     web3.eth.getAccounts().then(accounts => {
      const networkID  ='97'; //trocar para 5777 de for usa o Ganache
      const networkData = SmartTokens.networks[networkID];
      const contractAddress = networkData.address; // Substitua pelo contract address Truffle netwoerk local SmartTokens: 0x4aFdd4798c08B7bAA0b2D54Bd9CD57CEcC4C09ab
      console.log('contractAddress Informações da criaçao do token::', contractAddress);  
      const smartContract = new web3.eth.Contract(SmartTokens.abi, contractAddress);
      const gasPrice = web3.eth.getGasPrice();
       smartContract.methods.getMintedTokenInfoAll().call() //send envia dados para blockchai, call chama informação.
        .then(tokens => {
        // console.log('Info instancia smartContract useEffect:', smartContract); 
          console.log('Info instancia smartContract:', tokens); 
          console.log('Gas Price (Wei):', gasPrice);
        })
        .catch(error => {
          console.error('Erro ao obter Informações da criaçao do token:', error);
        });

     }); 
    }
  }, []);

  return(
    <Section id="showcase">
      
                      <p>Wallet logado:  <a href={`https://testnet.bscscan.com/address/${owner}`} target="_blank" rel="noopener noreferrer">
                      {`${owner.toUpperCase().slice(0, 6)}...${owner.toUpperCase().slice(-6)}`}
                      </a></p>
                      <p>account: <a href={`https://testnet.bscscan.com/address/${contractOwner}`} target="_blank" rel="noopener noreferrer">
                       {`${contractOwner.toUpperCase().slice(0, 6)}...${contractOwner.toUpperCase().slice(-6)}`}
                      </a></p> 
                      <p>Contract Intance: <a href={`https://testnet.bscscan.com/address/${contractInstance}`} target="_blank" rel="noopener noreferrer">
                       {`${contractInstance.toUpperCase().slice(0, 6)}...${contractInstance.toUpperCase().slice(-6)}`}
                      </a></p>    
                         
      <form onSubmit={handleMint}>
      <div className="form-group">
        <label>
          Qtde de Tokens (CCT):
          <input type="number" value={CCT} onChange={(e) => setCCT(e.target.value)} />
        </label>
      </div>
      <div className="form-group">
        <label>
          Nome do Projeto:
          <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
        </label>
      </div>
      <div className="form-group">
        <label>
          Data de Início:
          <input type="number" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
      </div>
      <div className="form-group">
        <label>
          Data de Término:
          <input type="number" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
      </div>
      <div className="form-group">
        <label>
         Reference document:
          <input type='file' onChange={captureFile} />
        </label>
      </div>
      <div className="form-group">
        <button type="submit" disabled={loading}>
          {loading ? 'Mintando...' : 'Mintar'}
        </button>
      </div>
    </form> 
    </Section>
  )
}

export default Showcase