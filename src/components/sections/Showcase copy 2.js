import React, {  useState, useEffect } from 'react'
import styled from 'styled-components'
import Web3 from 'web3';
import SmartTokens from './SmartTokens.json';

const Section = styled.section`
min-height: 100vh;
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
  const [ipfsHash, setIpfsHash] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // O Web3 Dentro do componente useEffect para obter a instância do contrato:
    if (window.ethereum) {
      const web3  = new Web3(window.ethereum);
      setWeb3(web3);

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
      const networkID  ='80001'; //trocar para 5777 de for usa o Ganache
      const networkData = SmartTokens.networks[networkID];
      const contractAddress = networkData.address; // Substitua pelo contract address Truffle netwoerk local SmartTokens: 0x4aFdd4798c08B7bAA0b2D54Bd9CD57CEcC4C09ab
      
      console.log('Contract Adress: ', contractAddress);
      setContractInstance(contractAddress);
      console.log('Contract Intance: ', contractInstance);
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

  //Função para lidar com o envio do formulário e chamar a função mint do contrato inteligente:
  const handleMint = async (e) => {
    e.preventDefault();
  
    try {
      setLoading(true);

      const networkID  ='80001'; //trocar para 5777 de for usa o Ganache
      const networkData = SmartTokens.networks[networkID];    
      // Crie uma instância do contrato inteligente
      const contractDeploy ='0xbc18fb6C7b758A8F5392f82572488c250ef19C03'// networkData.address; // Substitua pelo endereço do seu contrato que fez o Deploy na rede blockchan
      console.log('Contract Adress Mint: ', contractDeploy);
      const smartContract = new web3.eth.Contract(SmartTokens.abi, contractDeploy);
      
      // Chame a função mint
      const newGasPrice = web3.utils.toWei('100', 'gwei'); // Substitua '100' pelo valor desejado em gwei
      console.log('gas', newGasPrice);
      const tx = await smartContract.methods.mint(
        CCT,
        projectName,
        startDate,
        endDate,
        ipfsHash,
        '0x' // Data vazia, você pode adicionar dados personalizados aqui se necessário
      ).send({ //send envia dados para blockchain, call busca
        from: owner,  // Conta do usuário atual
        gasPrice: newGasPrice
      });
  
      
      console.log('Transação concluída:', tx);
      console.log('Transaction Hash:', tx.transactionHash);
       

      // Limpe os campos do formulário
      setCCT(0);
      setProjectName('');
      setStartDate(0);
      setEndDate(0);
      setIpfsHash('');

     // Após a mintagem bem-sucedida, chame a função getMintedTokenInfoByContract
          
    //const tokenInfo = await smartContract.methods.getMintedTokenInfoAll().call()
  
    //console.log('Informações da transação Mint:', tokenInfo);

    } catch (error) {
      console.error('Erro ao chamar a função mint:', error);
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    // O Web3 Dentro do componente useEffect para obter a instância do contrato:
    if (window.ethereum) {
      const web3  = new Web3(window.ethereum);
      setWeb3(web3);

      // Solicite acesso à conta do usuário
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
          setOwner(accounts[0]);
          
        })
        .catch(error => {
          console.error(error);
        });

       // Obtenha informações dos Tokens criados
       web3.eth.getAccounts().then(accounts => {
        const networkID  ='80001'; //trocar para 5777 de for usa o Ganache
        const networkData = SmartTokens.networks[networkID];
        const contractAddress = networkData.address; // Substitua pelo contract address Truffle netwoerk local SmartTokens: 0x4aFdd4798c08B7bAA0b2D54Bd9CD57CEcC4C09ab
         const smartContract = new web3.eth.Contract(SmartTokens.abi, contractAddress);
  
         smartContract.methods.getMintedTokenInfoAll().call() //send envia dados para blockchai, call chama informação.
          .then(tokens => {
            console.log('Informações da criaçao do token:', tokens); 
          })
          .catch(error => {
            console.error('Erro ao obter Informações da criaçao do token:', error);
          });
  
       }); 
      }
    }, []);

  return(
    <Section id="showcase">
                      <p>Wallet logado:  <a href={`https://etherscan.io/address/${owner}`} target="_blank" rel="noopener noreferrer">
                      {`${owner.slice(0, 6)}...${owner.slice(-6)}`}
                      </a></p>
                      <p>account: <a href={`https://etherscan.io/address/${contractOwner}`} target="_blank" rel="noopener noreferrer">
                       {`${contractOwner.slice(0, 6)}...${contractOwner.slice(-6)}`}
                      </a></p> 
                      <p>Contract Intance: <a href={`https://etherscan.io/address/${contractInstance}`} target="_blank" rel="noopener noreferrer">
                       {`${contractInstance.slice(0, 6)}...${contractInstance.slice(-6)}`}
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
          IPFS Hash:
          <input type="text" value={ipfsHash} onChange={(e) => setIpfsHash(e.target.value)} />
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