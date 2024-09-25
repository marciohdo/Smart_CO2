import React from "react";
import styled from 'styled-components';
import florest from '../../assets/florest.png';
import smartcontracts from '../../assets/smart-contracts.png';
import hand from '../../assets/hand.png';

const Section = styled.section`
  min-height: 100vh;
  width: 100vw;
  background-color: #F8F8F8;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: ${(props) => props.theme.fontxxl};
  text-transform: capitalize;
  color: ${(props) => props.theme.text};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem auto;
  border-bottom: 2px solid ${(props) => props.theme.text};
  width: fit-content;
`;

const FeatureListItem = styled.div`
  display: flex;
  align-items: center;
  max-width: calc(400px + 20%);
  padding: 10px;
  border-top: ${props => props.first ? 'none' : '1px solid #D7DBDD'};
  margin-bottom: 10px;
`;

const Icon = styled.div`
  padding: 5px 15px;

  img {
    width: 60px;
    transform: scale(1.3);
  }
`;

const Description = styled.div`
  color: #57727C;
  font-size: 20px;
  padding: 20px 25px;
`;

const Roadmap = () => {
  return (
    <Section id="roadmap">
      <Title>Roadmap</Title>
      <FeatureListItem first>
        <Icon>
          <img src={florest} alt="florest" />
        </Icon>
        <Description>Tokenize os Projetos Certificados de Crédito de Carbono, tornando-os únicos e comercializáveis.</Description>
      </FeatureListItem>
      <FeatureListItem className="featureListItem--reverse">
        <Description>Construa contratos inteligentes com tecnologias Web3 e gere tokens únicos e comercializáveis com total segurança e rastreabilidade na rede Blockchain.</Description>
        <Icon>
          <img src={smartcontracts} alt="smartcontracts" />
        </Icon>
      </FeatureListItem>
      <FeatureListItem>
        <Icon>
          <img src={hand} alt="hand" />
        </Icon>
        <Description>Adquira e comercialize seus créditos de carbono em projetos certificados e confiáveis de empresas líderes mundiais.</Description>
      </FeatureListItem>
    </Section>
  );
};

export default Roadmap;
