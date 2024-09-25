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

  useEffect(() => {
    if (window.ethereum) { //mudar isso para para de precisar de alguma carteira conectada
      const web3 = new Web3(window.ethereum);
      //const web3 = new Web3("https://bsc-dataseed.binance.org/");

      web3.eth.getAccounts().then(accounts => {
        const networkID = '97';
        const networkData = SmartTokens.networks[networkID];
        const contractAddress = networkData.address;
        const smartContract = new web3.eth.Contract(SmartTokens.abi, contractAddress);
    
        smartContract.methods.getMintedTokenInfoAll().call()
          .then(tokens => {
              const newCards = tokens.projectNames.map((name, index) => {
              const fullHash = tokens.ipfsHashes[index];

              const shortenedHash = `${fullHash.slice(0, 6)}...${fullHash.slice(-6)}`; // usado no card par imprimir o ipfs
              const fullCreatorContract = tokens.creatorContracts[index]; // usado no Card

              const CreatorContractInt = parseInt(tokens.creatorContracts[index]); // usado no filtro do endpoint

              const creatorContract = `${fullCreatorContract.slice(0, 6)}...${fullCreatorContract.slice(-6)}`;

              const fullTokenId = parseInt(tokens.tokenIds[index]);
              const fullTokenIdApi = `${fullTokenId}`;
              const fullCreatorContractApi = `${tokens.creatorContracts[index]}`;
              console.log('tID:',fullTokenIdApi, 'con',fullCreatorContractApi);
    
              async function fetchTokenData(fullCreatorContract, fullTokenIdApi) {
                try {
                  const response = await axios.get(`https://api-testnet.bscscan.com/api?module=account&action=token1155tx&address=${fullCreatorContract}&startblock=36336623&endblock=39188270&sort=asc&apikey=JFMTI8MEHIXHTZ7WNBYEB31129AFIIT62P`);
                  const data = response.data;
                  console.log(response);

                  if (data.status === '1' && data.message === 'OK' && Array.isArray(data.result) && data.result.length > 0) {
                    const filteredData = data.result.filter(item => item.tokenID === fullTokenIdApi && item.from === fullCreatorContract);
                    if (filteredData.length > 0) {
                      const { timeStamp, hash, contractAddress, from, to, tokenID, tokenValue } = filteredData[0];
                      return { timeStamp, hash, contractAddress, from, to, tokenID, tokenValue };
                    } else {
                      throw new Error('Nenhum dado correspondente encontrado.'); 
                    }
                  } else {
                    throw new Error('Resposta da API não está no formato esperado.');
                  }
                } catch (error) {
                  throw new Error('Erro ao buscar dados na API:', error);
                }
              }

             fetchTokenData(fullCreatorContractApi, fullTokenIdApi)
           //fetchTokenData('0x07006DdFAFE43606E1282A18122b7458402cD0EB', '1')
                .then(data => console.log(data))
                .catch(error => console.error(error.message));
    
              return {
                img: 'https://via.placeholder.com/200',
                title: name || 'Nome do projeto',
                tokenId: `TokenID: ${tokens.tokenIds[index]}`,
                creatorContractHash: (
                  <a
                    href={`https://testnet.bscscan.com/address/${fullCreatorContract}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {`Propietario: ${creatorContract}`}
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
                    href={`https://carbon-credit-carbon-br.infura-ipfs.io/ipfs/${fullHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {`IPFS: ${shortenedHash}`}
                  </a>
                ),
                buttonText: 'Saiba mais...',
                expanded: false,
              };
            });
    
            setCards(newCards);
          })
          .catch(error => {
            console.error('Erro ao obter Informações da criação do token:', error);
          });
      });
    
    }
  }, []); // Dependência vazia, isso faz com que o useEffect seja executado apenas uma vez durante a montagem inicial

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
              />}
            </div>
          </Item>
        ))}
      </Container>
    </Section>
  );
};

export default Team;
