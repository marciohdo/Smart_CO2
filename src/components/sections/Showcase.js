import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Web3 from 'web3';
import SmartTokens from './SmartTokens.json';
import { ipfsClient } from '../ipfs/ipfsApi.js';

// Importando as imagens
import IpfsLogo from '../../assets/Ipfs-logo.png';
import BNBLogo from '../../assets/Binance.png';

const Section = styled.section`
  min-height: 100vh;
  width: 100vw;
  background-color: #f0f2f5;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  padding: 20px;
  max-width: 400px;
  width: 100%;
  background-color: #f0f2f5;
  text-align: right;
  margin-left: 185px; /* Adicionando margem para mover o LeftContainer mais para o centro */

  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
    margin-left: 0; /* Removendo margem em telas pequenas */
  }

  img {
    margin-top: 10px;
  }

  .logo-container {
    display: flex;
    justify-content: flex-end; /* Alinha os logos à direita */
    width: 100%;
    align-items: center;

    @media (max-width: 768px) {
      justify-content: center; /* Centraliza os logos em telas pequenas */
    }
  }

  .ipfs-logo {
    width: 50px; /* Metade do tamanho atual */
    height: auto;
    margin-left: 10px;
  }

  .bnb-logo {
    width: 200px; /* Dobro do tamanho atual */
    height: auto;
  }
`;

const RightContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100vh;

  @media (max-width: 768px) {
    align-items: center;
    width: 100%;
    height: auto;
  }
`;

const Title = styled.h1`
  color: #000;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 50%;
  align-items: flex-start;
  margin-left: 20px;

  @media (max-width: 768px) {
    width: 80%;
    margin-left: 0;
  }
`;

const Label = styled.label`
  margin-bottom: 8px;
  font-weight: bold;
  text-align: left;
  width: 100%;
`;

const Input = styled.input`
  margin-bottom: 16px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  background-color: #f0f2f5;
`;

const SmallText = styled.small`
  margin-bottom: 10px;
  display: block;
  color: #666;
`;

const Paragraph = styled.p`
  margin-bottom: 10px;
`;

const StyledButton = styled.button`
  display: inline-block;
  background-color: ${props => props.theme.text};
  color: ${props => props.theme.body};
  outline: none;
  border: none;
  font-size: ${props => props.theme.fontsm};
  padding: 0.9rem 2.25rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    transform: scale(0.9);
  }

  &::after {
    content: ' ';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    border: 2px solid ${props => props.theme.text};
    width: 100%;
    height: 100%;
    border-radius: 50px;
    transition: all 0.2s ease;
  }

  &:hover::after {
    transform: translate(-50%, -50%) scale(1);
    padding: 0.3rem;
  }
`;

const Showcase = () => {
  const [contractOwner, setContractOwner] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contractInstance, setContractInstance] = useState('null');
  const [owner, setOwner] = useState('');
  const [CCT, setCCT] = useState(0); // Quantidade de Tokens
  const [projectName, setProjectName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [ipfsHash, setIpfsHash] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      setWeb3(web3);

      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
          setOwner(accounts[0]);
        })
        .catch(error => {
          console.error(error);
        });

      web3.eth.getAccounts().then(accounts => {
        const networkID = '97';
        const networkData = SmartTokens.networks[networkID];
        const contractAddress = networkData.address;

        console.log('Contract Adress: ', contractAddress);
        setContractInstance(contractAddress);
        console.log('Contract Instance: ', contractInstance);

        const smartContract = new web3.eth.Contract(SmartTokens.abi, contractAddress);
        smartContract.methods.owner().call()
          .then(ownerAddress => {
            setContractOwner(ownerAddress);
          })
          .catch(error => {
            console.error('Erro ao obter o endereço do dono do contrato:', error);
          });
      });
    }
  }, []);

  const captureFile = (e) => {
    return new Promise((resolve, reject) => {
      e.preventDefault();
      const file = e.target.files[0];

      const reader = new window.FileReader();

      reader.onloadend = () => {
        const buffer = new Uint8Array(reader.result);
        setIpfsHash(buffer);
        console.log('=== buffer Ok ===', buffer);
        resolve(buffer);
      };

      reader.onerror = (error) => {
        console.error('Erro ao ler arquivo:', error);
        reject(error);
      };

      if (file) {
        reader.readAsArrayBuffer(file);
      } else {
        reject(new Error('Nenhum arquivo selecionado.'));
      }
    });
  };

  const handleMint = async (e) => {
    e.preventDefault();
    setLoading(true);

    const ipfs = await ipfsClient();

    ipfs.add(ipfsHash).then(result => {
      const hash = result.path;
      console.log('Ipfs ok result', hash);

      try {
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);

          web3.eth.getAccounts().then(async accounts => {
            const networkID = '97';
            const networkData = SmartTokens.networks[networkID];
            const contractAddress = networkData.address;
           // console.log('contractAddress Informações da criação do token:', contractAddress);
            const smartContract = new web3.eth.Contract(SmartTokens.abi, contractAddress);

            const gasLimit = web3.utils.toWei('0.00143629', 'gwei');
            const gasPrice = await web3.eth.getGasPrice();

            const _startDate = Date.parse(startDate);
            const startingDate = _startDate / 1000;
            const _endDate = Date.parse(endDate);
            const endingDate = _endDate / 1000;

            const tx = await smartContract.methods.mint(CCT, projectName, startingDate, endingDate, hash)
              .send({ from: owner, gas: gasLimit, gasPrice: gasPrice });

         //   console.log('Transação concluída:', tx);
        //    console.log('Transaction Hash:', tx.transactionHash);

            alert('Tokens CO2 criados com sucesso!'); // Alerta quando a transação é bem-sucedida

            setCCT(0);
            setProjectName('');
            setStartDate('');
            setEndDate('');
            setIpfsHash(null);
          }).catch(error => {
            if (error.message.includes('User denied transaction signature')) {
              alert('Transação cancelada pelo usuário.');
            } else {
              console.error('Erro ao obter as contas ou enviar a transação:', error);
            }
          });
        }
      } catch (error) {
        console.error('Erro ao chamar a função mint:', error);
      } finally {
        setLoading(false);
      }
    }).catch(error => {
      console.log("Erro aqui");
      console.error(`erro aqui:${error}`);
      setLoading(false);
    });
  };

  return (
    <Section id="showcase">
      <LeftContainer>
        <Paragraph>
          <Title>Crie seus Tokens</Title>
        </Paragraph>
        <div className="logo-container">
          <img src={BNBLogo} alt="Binance Logo" className="bnb-logo" />
          <img src={IpfsLogo} alt="IPFS Logo" className="ipfs-logo" />
        </div>
      {/*  <Paragraph>Conta:
          <a href={`https://testnet.bscscan.com/address/${contractOwner}`} target="_blank" rel="noopener noreferrer">
            {`${contractOwner.toUpperCase().slice(0, 6)}...${contractOwner.toUpperCase().slice(-6)}`}
          </a>
        </Paragraph>
        <Paragraph>Instância do Contrato:
          <a href={`https://testnet.bscscan.com/address/${contractInstance}`} target="_blank" rel="noopener noreferrer">
            {`${contractInstance.toUpperCase().slice(0, 6)}...${contractInstance.toUpperCase().slice(-6)}`}
          </a>
        </Paragraph> */}
      </LeftContainer>
      <RightContainer>
        <Form onSubmit={handleMint}>
          <Label htmlFor="CCT">Qtde de Tokens (CCT):</Label>
          <Input
            id="CCT"
            type="number"
            value={CCT}
            onChange={(e) => setCCT(e.target.value)}
            required
          />

          <Label htmlFor="projectName">Nome do Projeto:</Label>
          <Input
            id="projectName"
            type="text"
            placeholder="ex: Projeto ambiental Comunidade.."
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />

          <Label htmlFor="startDate">Data de Início:</Label>
          <Input
            id="startDate"
            type="text"
            placeholder="ex: 2021/01/30"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />

          <Label htmlFor="endDate">Data de Término:</Label>
          <Input
            id="endDate"
            type="text"
            placeholder="ex: 2027/01/30"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />

          <Label htmlFor="referenceDocument">Documento de Referência(IPFS):</Label>
          <Input
            id="referenceDocument"
            type="file"
            onChange={captureFile}
          />

          <SmallText>
          Ao criar um NFT, você concorda com os Termos de Serviço e a Política de Privacidade.
          Wallet logado:
          <a href={`https://testnet.bscscan.com/address/${owner}`} target="_blank" rel="noopener noreferrer">
            {`${owner.toUpperCase().slice(0, 6)}...${owner.toUpperCase().slice(-6)}`}
          </a>
        
          </SmallText>
          <StyledButton type="submit" disabled={loading}>
            {loading ? 'Criando...' : 'Tokenizar o crédito de carbono'}
          </StyledButton>
        </Form>
      </RightContainer>
    </Section>
  );
}

export default Showcase;
