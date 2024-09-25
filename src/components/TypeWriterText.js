import React from "react";
import styled from "styled-components";
import Typewriter from "typewriter-effect";
import Button from './Button';

const Title = styled.h2`
  font-size: ${(props) => props.theme.fontxxl};
  width: 80%;
  color: ${(props) => props.theme.text};
  align-self: flex-start;
  font-weight: bold; /* Define o texto como negrito */

  span {
    text-transform: uppercase;
    font-family: "Pacific"; 
    font-weight: bold; /* Define o texto como negrito */
  }
  .text-1 {
    color: #068dff;
  }
  .text-2 {
    color: #59b3ff;
  }
  .text-3 {
    color: #54c286;
  }

  @media (max-width: 70em) {
    font-size: ${(props) => props.theme.fontxl};
  }
  @media (max-width: 48em) { 
    align-self: center;
    text-align: center;
  }
  @media (max-width: 40em) {
    width: 90%;
  }
`;

const SubTitle = styled.h3`
  font-size: ${(props) => props.theme.fontlg};
  color: ${props => `rgba(${props.theme.textRgba}, 0.6)`};
  font-weight: 600;
  margin-bottom: 1rem;
  width: 80%;
  align-self: flex-start;

  @media (max-width: 40em) {
    font-size: ${(props) => props.theme.fontmd};
  }

  @media (max-width: 48em) { 
    align-self: center;
    text-align: center;
  }
`;

const ButtonContainer = styled.div`
  width: 80%;
  align-self: flex-start;

  @media (max-width: 48em) { 
    align-self: center;
    text-align: center;

    button {
      margin: 0 auto;
    }
  }
`;

const TypeWriterText = () => {
  return (
    <>
      <Title>
      Comercialização de créditos de carbono
        <Typewriter
          options={{
            autoStart: true,
            loop: true,
          }}
          onInit={(typewriter) => {
            typewriter
              .typeString(`<span class="text-1">Blockchain</span>`)
              .pauseFor(2000)
              .deleteAll()
              .typeString(`<span class="text-2">Imutável</span>`)
              .pauseFor(2000)
              .deleteAll()
              .typeString(`<span class="text-3">Acessível</span>`)
              .pauseFor(2000)
              .deleteAll()
              .typeString(`<span class="text-3">Escalável!</span>`)
              .pauseFor(2000)
              .deleteAll()
              .start();
          }}
        />
      </Title>
      <SubTitle>Cada crédito tornou-se único, rastreável e muito mais seguro!</SubTitle>
      <ButtonContainer>
        <Button text="Explore" link="#about" />
      </ButtonContainer>
    </>
  );
};

export default TypeWriterText;
