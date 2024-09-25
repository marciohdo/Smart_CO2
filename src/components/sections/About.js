import React, { lazy, Suspense } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Button from '../Button';
import { dark } from '../../styles/Themes';
import Loading from '../Loading';
import VerraLogo from '../../assets/Verra-Logo.png';
import GoldStandardLogo from '../../assets/logo_gold_standard.png';
import VCSLogo from '../../assets/logo-VCS.png';

const Carousel = lazy(() => import("../Carousel"));

const Section = styled.section`
  min-height: 100vh;
  width: 100%;
  background-color: ${(props) => props.theme.text};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  width: 75%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 70em) {
    width: 85%;
  }

  @media (max-width: 64em) {
    width: 100%;
    flex-direction: column;

    & > *:last-child {
      width: 80%;
    }
  }

  @media (max-width: 40em) {
    & > *:last-child {
      width: 90%;
    }
  }
`;

const Box = styled.div`
  width: 50%;
  height: 100%;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: 40em) {
    min-height: 50vh;
  }
`;

const Title = styled.h2`
  font-size: ${(props) => props.theme.fontxxl};
  color: ${(props) => props.theme.body};
  align-self: flex-start;
  width: 80%;
  margin: 0 auto;

  @media (max-width: 64em) {
    width: 100%;
    text-align: center;
  }

  @media (max-width: 40em) {
    font-size: ${(props) => props.theme.fontxl};
  }

  @media (max-width: 30em) {
    font-size: ${(props) => props.theme.fontlg};
  }
`;

const SubText = styled.p`
  font-size: ${(props) => props.theme.fontlg};
  color: ${(props) => props.theme.body};
  align-self: flex-start;
  width: 80%;
  margin: 1rem auto;
  font-weight: 400;

  @media (max-width: 64em) {
    width: 100%;
    text-align: center;
    font-size: ${(props) => props.theme.fontmd};
  }

  @media (max-width: 40em) {
    font-size: ${(props) => props.theme.fontmd};
  }

  @media (max-width: 30em) {
    font-size: ${(props) => props.theme.fontsm};
  }
`;

const SubTextLight = styled.p`
  font-size: ${(props) => props.theme.fontmd};
  color: ${(props) => `rgba(${props.theme.bodyRgba},0.6)`};
  align-self: flex-start;
  width: 80%;
  margin: 1rem auto;
  font-weight: 400;

  @media (max-width: 64em) {
    width: 100%;
    text-align: center;
    font-size: ${(props) => props.theme.fontsm};
  }

  @media (max-width: 40em) {
    font-size: ${(props) => props.theme.fontsm};
  }

  @media (max-width: 30em) {
    font-size: ${(props) => props.theme.fontxs};
  }
`;

const ButtonContainer = styled.div`
  width: 80%;
  margin: 1rem auto;
  display: flex;
  justify-content: center;
  align-self: center;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap; /* Permite que os itens sejam distribuídos em várias linhas */

  img {
    width: auto;
    height: 100px; /* Set a fixed height for VerraLogo and GoldStandardLogo */
    margin: 10px; /* Ajusta a margem para criar espaço entre as imagens */
  }

  img.vcs {
    height: 40px; /* Set a smaller height for VCSLogo */
  }

  @media (max-width: 64em) {
    img {
      height: 160px;
    }

    img.vcs {
      height: 80px;
    }
  }

  @media (max-width: 40em) {
    img {
      height: 200px;
    }

    img.vcs {
      height: 100px;
    }
  }
`;

const About = () => {
  return (
    <Section id="about">
      <Container>
        <Box>
          <Suspense fallback={<Loading />}>
            <Carousel />
          </Suspense>
        </Box>
        <Box>
          <Title>
            Neutralize emissões de carbono apoiando projetos certificados.
          </Title>
          <SubText>
            Através da tecnologia Blockchain tokenizamos o crédito de carbono.
          </SubText>
          <SubTextLight>
            Cada crédito tornou-se único, rastreável e muito mais seguro.
            Adquira rapidamente e facilmente projetos certificados por uma
            curadoria especializada em iniciativas confiáveis de empresas
            líderes mundiais.
          </SubTextLight>
          <LogoContainer>
            <img src={VerraLogo} alt="Verra Logo" />
            <img src={GoldStandardLogo} alt="Gold Standard Logo" />
            <img src={VCSLogo} alt="VCS Logo" className="vcs" />
          </LogoContainer>
          <ButtonContainer>
            <ThemeProvider theme={dark}>
              <Button text="JUNTE-SE A NÓS NO DISCORD" link="#" />
            </ThemeProvider>
          </ButtonContainer>
        </Box>
      </Container>
    </Section>
  );
};

export default About;
