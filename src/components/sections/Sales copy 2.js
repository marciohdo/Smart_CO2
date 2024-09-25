import React from "react";
import styled from 'styled-components';

const Section = styled.section`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background-color: #F8F6F4;
  padding: 20px;
  border-radius: 5px;
  width: 90vw; /* Ocupa 100% da largura da tela */
  height: 95vh; /* Ocupa 90% da altura da tela */
  /*overflow-y: auto; /* Adicionado para permitir rolagem vertical, se necessário */
`;

const TitleReturn = styled.h1`
    font-size: 2rem;
    margin-bottom: 20px; /* Espaçamento abaixo do título */
    text-align: center; /* Centraliza o texto */
    color: #888;
`;


const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    color: #888;
`;


const Container = styled.div`
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
    margin-top: 40px;
    width: 100%; /* Alteração para ocupar 100% da largura da seção */
    height: 90%; /* Alteração para ocupar 100% da altura da seção */
    overflow-y: auto; /* Adicionado para permitir rolagem vertical */
`;

const Row = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between; /* Distribui o espaço entre as colunas */
`;

const Column = styled.div`
    flex-basis: calc(50% - 5px); /* Calcula a largura das colunas com um espaçamento de 10px entre elas */
    margin-bottom: 20px; /* Espaço entre as linhas de cards */

    @media (max-width: 768px) { /* Estilos para telas menores ou iguais a 768px (tamanho de um celular) */
        flex-basis: 100%; /* Define a largura da coluna como 100% para ocupar toda a largura */
    }
`;

const CardContainer = styled.div`
    margin-bottom: 10px; /* Espaço entre os cards na mesma coluna */
`;

const Card = styled.div`
    border-radius: 8px;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    padding: 20px;
    background-color: #fff; /* Cor de fundo do card */
`;

const ImageContainer = styled.div`
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
`;

const Image = styled.img`
    width: 100%; /* Ajusta a largura da imagem para ocupar 100% do container */
    height: auto; /* Mantém a altura proporcional à largura */
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
`;

const CardBody = styled.div`
    padding-top: 20px; /* Espaçamento acima do título */
`;

const Title = styled.h5`
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
`;

const Text = styled.p`
    margin-bottom: 0.5rem;
`;

const Button = styled.a`
    display: inline-block;
    background-color: #007bff;
    color: #fff;
    padding: 0.375rem 0.75rem;
    border-radius: 30px;
    text-decoration: none;
`;

const CardComponent = ({ title, imgSrc, alt, description, buttonText }) => {
    return (
        <CardContainer>
            <Card>
                {imgSrc && (
                    <ImageContainer>
                        <Image src={imgSrc} alt={alt} />
                    </ImageContainer>
                )}
                <CardBody>
                    <Title>{title}</Title>
                    {description && description.map((text, index) => (
                        <Text key={index}>{text}</Text>
                    ))}
                    {buttonText && <Button href="#" className="btn btn-primary">{buttonText}</Button>}
                </CardBody>
            </Card>
        </CardContainer>
    );
};
 
const Sales = ({ onClose, cardTitle, cardnumTokens, cardDataInicio, cardDataFinal, cardIpfsHash }) => {
    const cards = [
        {
            title: cardTitle,
            imgSrc: 'https://via.placeholder.com/400x300',
            alt: 'Reforestation Rodenbach',
            description: ['Planned for 2022', cardDataInicio, cardDataFinal,  'Agriculture / Forestry / Other Land Use']
        },
        {
            title: 'Documentação do Projeto na VERRA',
            description: [cardIpfsHash,'Acesso o link acima']
        },
        {
            title: cardnumTokens,
            description: ['Get started today! Buy carbon credits and get a retirement certificate.'],
            buttonText: 'Compre por $25.50 / tCO2'
        },
        {
            title: 'New Card Below Buy and Retire Carbon Credits',
            description: [
                'Este é um dos projetos que você pode apoiar com a neutralização de suas emissões.',
                'Este é um dos projetos que você pode apoiar com a neutralização de suas emissões.',
                'Este é um dos projetos que você pode apoiar com a neutralização de suas emissões.'
            ]
        }
    ];

    return (
        <Section>
            <CloseButton onClick={onClose}>Fechar X</CloseButton>
            <TitleReturn>Compre créditos de carbono</TitleReturn>
            <Container>
                <Row>
                    <Column>
                        <CardComponent {...cards[0]} />
                        <CardComponent {...cards[1]} />
                    </Column>
                    <Column>
                        <CardComponent {...cards[2]} />
                        <CardComponent {...cards[3]} />
                    </Column>
                </Row>
            </Container>
        </Section>
    );
};

export default Sales;
