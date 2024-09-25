import React, { useEffect, useState, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Web3 from 'web3';
import axios from 'axios';
import SmartTokens from './SmartTokens.json';
import Sales from './Sales'; // Importar o componente Sales

const scrollToRef = (ref) => {
  if (ref.current) {
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

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
  margin-bottom: 100px; /* Adiciona espaçamento inferior para evitar sobreposição */
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
  width: calc(25% - 10px); /* Definindo 4 cards por linha, com espaço entre eles */
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

  @media (max-width: 75em) {
    width: calc(33.3333% - 10px); /* 3 cards por linha */
  }

  @media (max-width: 56em) {
    width: calc(50% - 10px); /* 2 cards por linha */
  }

  @media (max-width: 30em) {
    width: 100%; /* 1 card por linha */
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

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url, retries = 5, delayTime = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      if (i === retries - 1 || !error.response || error.response.status !== 429) {
        throw error;
      }
      await delay(delayTime * Math.pow(2, i)); // Exponential backoff
    }
  }
};

const Team = () => {
  const [cards, setCards] = useState([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [isMarketplaceTransparent, setIsMarketplaceTransparent] = useState(false);
  const myRef = useRef(null); // Cria uma ref para o elemento que você deseja rolar

  const hiddenTokenIds = ['2', '4', '5','6','8', '10','11','12','15']; // IDs dos cartões que você não quer exibir

  const fetchTokenData = async (fullTokenIdApi, fullCreatorContract) => {
    const apiUrl = `https://api-testnet.bscscan.com/api?module=account&action=token1155tx&address=${fullCreatorContract}&startblock=36336623&endblock=latest&sort=asc&apikey=JFMTI8MEHIXHTZ7WNBYEB31129AFIIT62P`;
    const data = await fetchWithRetry(apiUrl);

    console.log(`API Response for tokenID ${fullTokenIdApi}:`, data);

    if (data.status === '1' && data.message === 'OK' && Array.isArray(data.result)) {
      // Filtrando e removendo itens com from '0x0000000000000000000000000000000000000000'
      const filteredData = data.result.filter(item => item.from !== '0x0000000000000000000000000000000000000000');
      
      return filteredData; // Retorna todos os dados filtrados relevantes
    }
    return [];
  };

  useEffect(() => {
    const fetchData = async () => {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const networkID = '97';
      const networkData = SmartTokens.networks[networkID];
      const contractAddress = networkData.address;
      const smartContract = new web3.eth.Contract(SmartTokens.abi, contractAddress);

      const tokens = await smartContract.methods.getMintedTokenInfoAll().call();
      
      for (const index of tokens.projectNames.keys()) {
        const name = tokens.projectNames[index];
        const fullTokenId = tokens.tokenIds[index].toString();
        const fullCreatorContract = tokens.creatorContracts[index].toLowerCase();

        if (hiddenTokenIds.includes(fullTokenId)) {
          continue; // Pule a adição desse cartão
        }

        await delay(1000); // Atraso de 1 segundo entre as chamadas de API

        const tokenData = await fetchTokenData(fullTokenId, fullCreatorContract);
        console.log(`Filtered tokenData for tokenID ${fullTokenId}:`, tokenData);

        const buyersList = tokenData
          .filter(item => item.tokenID === fullTokenId)
          .map(item => `Comprador: ${item.to}, Qte tokens: ${item.tokenValue}, Data: ${new Date(Number(item.timeStamp) * 1000).toLocaleDateString()}, Hash: ${item.hash}`);

        const totalTokensVendidos = tokenData
          .filter(item => item.tokenID === fullTokenId)
          .reduce((total, item) => total + parseInt(item.tokenValue, 10), 0);

        const vendidosList = `Vendidos: ${totalTokensVendidos}`;

        setCards(prevCards => [...prevCards, {
          img: 'https://via.placeholder.com/200',
          title: name || 'Project Name',
          tokenId: `TokenID: ${fullTokenId}`,
          to: buyersList.join('; '),
          vendidos: vendidosList,
          creatorContractHash: (
            <a href={`https://testnet.bscscan.com/address/${fullCreatorContract}`} target="_blank" rel="noopener noreferrer">
            {`Propietario: ${fullCreatorContract.toUpperCase().slice(0, 6)}...${fullCreatorContract.toUpperCase().slice(-6)}`}
          </a>
          ),
          numTokens: `${tokens.CCTs[index]} tokens disp.`,
          dataInicio: (
            <p>Início: {`${new Date(Number(tokens.startDates[index]) * 1000).toLocaleDateString()}`}</p>
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
              {`${tokens.ipfsHashes[index].toUpperCase().slice(0, 6)}...${tokens.ipfsHashes[index].toUpperCase().slice(-6)}`}
             </a>
          ),
          buttonText: 'Saiba mais...',
          expanded: false
        }]);
      }
    };

    fetchData();
  }, []);

  const toggleExpand = index => {
    setSelectedCardIndex(index);
    setIsMarketplaceTransparent(true);
    scrollToRef(myRef); // Chama scrollIntoView quando um card é expandido
    setCards(prevCards =>
      prevCards.map((card, i) => i === index ? { ...card, expanded: !card.expanded } : { ...card, expanded: false })
    );
  };

  const handleCloseSales = () => {
    setSelectedCardIndex(null);
    setIsMarketplaceTransparent(false);
    setCards(prevCards => prevCards.map(card => ({ ...card, expanded: false })));
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
            <Position>{card.vendidos}</Position>
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
