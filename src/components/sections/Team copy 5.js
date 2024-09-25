import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Web3 from 'web3';
import axios from 'axios'; // Importar o Axios para fazer solicitações HTTP
import SmartTokens from './SmartTokens.json';
import Sales from './Sales'; // Importar o componente Sales


// Estilos globais para a página
const GlobalStyles = createGlobalStyle`
  body {
    background-color: ${props =>
      props.isMarketplaceTransparent ? 'rgba(248, 246, 244, 0.5)' : '#F8F6F4'}; /* Transparência de 50% na página Marketplace quando a Sales estiver aberta */
  }
`;

// Estrutura principal do projeto
const Section = styled.section`
  min-height: ${props => `${50 * Math.ceil(props.numberOfCards / 3)}vh`}; /* Ajusta dinamicamente a altura */
  width: 100vw;
  position: relative;
  overflow: hidden;
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontxxl};
  text-transform: capitalize;
  color: ${props => props.theme.text};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem auto;
  border-bottom: 2px solid ${props => props.theme.text};
  width: fit-content;

  @media (max-width: 40em) {
    font-size: ${props => props.theme.fontxl};
  }
`;

const Container = styled.div`
  width: 75%;
  margin: 2rem auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;

  @media (max-width: 64em) {
    width: 80%;
  }
  @media (max-width: 48em) {
    width: 90%;
    justify-content: center;
  }
`;

const Item = styled.div`
  width: calc(33.3333% - 10px); /* Definindo 3 cards por linha, com espaço entre eles */
  margin-bottom: 20px;
  position: relative;
  z-index: ${props => (props.expanded ? '10' : '5')}; /* Aumenta o z-index se o card estiver expandido */
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 5px;
  background-color: #f2f2f2;

  &:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 30em) {
    width: 70vw;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  border-radius: 5px 5px 0 0;

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
`;

const Name = styled.h2`
  font-size: 1.5rem;
  margin: 10px;
`;

const Position = styled.p`
  font-size: 1rem;
  margin: 10px;
`;

const AddCardButton = styled.button`
  border: none;
  outline: none;
  padding: 10px;
  color: white;
  background-color: black;
  text-align: center;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;
  border-radius: 50px;
  margin-top: 10px;
`;

const Team = () => {
  const [cards, setCards] = useState([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [isMarketplaceTransparent, setIsMarketplaceTransparent] = useState(false);
  const [buyer, setBuyer] = useState(''); // Estado para armazenar o comprador
  const [timeStamp, setTimeStamp] = useState('');
  const [hash, setHash] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [tokenID, setTokenID] = useState('');
  const [tokenValue, setTokenValue] = useState(null);

  const fetchTokenData = async (fullTokenIdApi, fullCreatorContract) => {
    try {
      const response = await axios.get(`https://api-testnet.bscscan.com/api?module=account&action=token1155tx&address=${fullCreatorContract}&startblock=36336623&endblock=39188270&sort=asc&apikey=JFMTI8MEHIXHTZ7WNBYEB31129AFIIT62P%27);%20const%20data%20=%20response.data`);
      const data = response.data;
  
      if (data.status === '1' && data.message === 'OK' && Array.isArray(data.result) && data.result.length > 0) {
        // Ordenando os dados em ordem crescente pelo tokenID
        const filteredData = data.result
          .filter(item => item.from !== '0x0000000000000000000000000000000000000000' && item.tokenID === fullTokenIdApi && item.from === fullCreatorContract)
          .sort((a, b) => a.tokenID - b.tokenID);
        
        if (filteredData.length > 0) {
          const tokenData = []; // Array para armazenar os dados de todos os itens filtrados
  
          filteredData.forEach(item => {
            const { timeStamp, hash, contractAddress, from, to, tokenID, tokenValue } = item;
            tokenData.push({ timeStamp, hash, contractAddress, from, to, tokenID, tokenValue });
          });
  
          return tokenData; // Retorna array com dados de todos os itens filtrados
        } else {
          throw new Error('Nenhum dado correspondente encontrado.');
        }
      } else {
        throw new Error('End-point rodou mas tem erro no formato de retorno.');
      }
    } catch (error) {
      throw new Error('Erro ao buscar dados na API (end-point): ' + error.message);
    }
  };
  

  useEffect(() => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      web3.eth.getAccounts().then(accounts => {
        const networkID = '97';
        const networkData = SmartTokens.networks[networkID];
        const contractAddress = networkData.address;
        const smartContract = new web3.eth.Contract(SmartTokens.abi, contractAddress);
    
        smartContract.methods.getMintedTokenInfoAll().call()
          .then(tokens => {
            const newCards = tokens.projectNames.map((name, index) => {
              const fullTokenId = parseInt(tokens.tokenIds[index]);
              const fullTokenIdApi = `${fullTokenId}`;
              const fullCreatorContractApi = `${tokens.creatorContracts[index]}`.toLowerCase();
         console.log('tokenID',fullTokenIdApi,'Propietario:',fullCreatorContractApi);
              
           //  return fetchTokenData(fullTokenIdApi, fullCreatorContractApi)
             return fetchTokenData('3','0x07006ddfafe43606e1282a18122b7458402cd0eb') 
                .then(data => {
                  const tokenIdExists = data && data.length > 0;
                 console.log('Qtde de tokens comprados:', data.length);
                  const tokenValue = tokenIdExists ? `Qte tokens comprados: ${data[0].tokenValue}` : 'Qte tokens comprados: N/A';
                 console.log('tokens comprados',data[0].tokenValue);
                  const to = tokenIdExists ? `Comprador: ${data[0].to}` : 'Comprador: N/A';
                 console.log('comprador', to );
    
                  return {
                    img: 'https://via.placeholder.com/200',
                    title: name || 'Nome do projeto',
                    tokenId: `TokenID: ${tokens.tokenIds[index]}`,
                    tokenValue,
                    to,
                    creatorContractHash: (
                      <a
                        href={`https://testnet.bscscan.com/address/${tokens.creatorContracts[index]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {`Propietario: ${tokens.creatorContracts[index]}`}
                      </a>
                    ),
                    numTokens: `${tokens.CCTs[index]} tokens`,
                    dataInicio: (
                      <p>Inicio: {`${new Date(Number(tokens.startDates[index]) * 1000).toLocaleDateString()}`}</p>
                    ),
                    dataFinal: (
                      <p>Fim: {`${new Date(Number(tokens.endDates[index]) * 1000).toLocaleDateString()}`}</p>
                    ),
                    ipfsHash: (
                      <a
                        href={`https://carbon-credit-carbon-br.infura-ipfs.io/ipfs/${tokens.ipfsHashes[index]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {`IPFS: ${tokens.ipfsHashes[index]}`}
                      </a>
                    ),
                    buttonText: 'Saiba mais...',
                    expanded: false,
                  };
                })
                .catch(error => {
                  console.error('Erro ao buscar dados na API:', error.message);
                  return {
                    img: 'https://via.placeholder.com/200',
                    title: name || 'Nome do projeto',
                    tokenId: `TokenID: ${tokens.tokenIds[index]}`,
                    tokenValue: 'Qte tokens comprados: N/A',
                    to: 'Comprador: N/A',
                    creatorContractHash: (
                      <a
                        href={`https://testnet.bscscan.com/address/${tokens.creatorContracts[index]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {`Propietario: ${tokens.creatorContracts[index]}`}
                      </a>
                    ),
                    numTokens: `${tokens.CCTs[index]} tokens`,
                    dataInicio: (
                      <p>Inicio: {`${new Date(Number(tokens.startDates[index]) * 1000).toLocaleDateString()}`}</p>
                    ),
                    dataFinal: (
                      <p>Fim: {`${new Date(Number(tokens.endDates[index]) * 1000).toLocaleDateString()}`}</p>
                    ),
                    ipfsHash: (
                      <a
                        href={`https://carbon-credit-carbon-br.infura-ipfs.io/ipfs/${tokens.ipfsHashes[index]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {`IPFS: ${tokens.ipfsHashes[index]}`}
                      </a>
                    ),
                    buttonText: 'Saiba mais...',
                    expanded: false,
                  };
                });
            });
    
            Promise.all(newCards)
              .then(cards => setCards(cards))
              .catch(error => console.error('Erro ao processar os cards:', error)); 
          })
          .catch(error => {
            console.error('Erro ao obter Informações da criação do token:', error);
          });
      });
    }
  }, []);
   // Dependência vazia, isso faz com que o useEffect seja executado apenas uma vez durante a montagem inicial

  const toggleExpand = index => {
    setSelectedCardIndex(index);
    setIsMarketplaceTransparent(true); // Torna a página 50% transparente quando um card é expandido
    setCards(prevCards =>
      prevCards.map((card, i) =>
        i === index ? { ...card, expanded: !card.expanded } : { ...card, expanded: false }
      )
    );
  };

  const handleCloseSales = () => {
    setSelectedCardIndex(null);
    setIsMarketplaceTransparent(false); // Restaura a opacidade da página ao fechar a Sales
    setCards(prevCards =>
      prevCards.map(card => ({ ...card, expanded: false }))
    );
  };

  return (
    <Section id="team" numberOfCards={cards.length}>
      <GlobalStyles isMarketplaceTransparent={isMarketplaceTransparent} /> {/* Aplica os estilos globais com base no estado da opacidade da página Marketplace */}
      <Title>Marketplace</Title>
      <Container>
        {cards.map((card, index) => (
          <Item key={index} expanded={card.expanded}>
            <ImageContainer>
              <img width={500} height={400} src={card.img} alt={card.title} />
            </ImageContainer>
            <Name>{card.title}</Name>
            <Position>{card.numTokens}</Position>
            <Position>{card.tokenId}</Position>
            <Position>{card.creatorContractHash}</Position>
            <Position>{card.dataInicio}</Position>
            <Position>{card.dataFinal}</Position>
            {/* <Position>{card.ipfsHash}</Position> o ipfs será mostrado somente o compomente Sales depois de clicar */}
            <AddCardButton onClick={() => toggleExpand(index)}>
              {card.expanded ? 'Fechar' : card.buttonText}
            </AddCardButton>
            <div className="content">
              {card.expanded && selectedCardIndex === index && <Sales onClose={handleCloseSales}
                cardTitle={card.title}
                cardDataInicio={card.dataInicio}
                cardDataFinal={card.dataFinal}
                cardnumTokens={card.numTokens}
                cardIpfsHash={card.ipfsHash}
                cardTokenId={card.tokenId} // Adicionando tokenId como propriedade
                cardCreatorContract={card.creatorContractHash} // Adicionando creatorContract como propriedade
                buyer={card.to} // Passa o valor de item.to como a propriedade buyer 
                QtdeTokens={card.tokenValue}               
              />}
            </div>
          </Item>
        ))}
      </Container>
    </Section>
  );
};

export default Team;
