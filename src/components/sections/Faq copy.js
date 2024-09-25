import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import React, { useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';
import Accordion from '../Accordion';

const Section = styled.section`
  min-height: 100vh;
  height: auto;
  width: 100vw;
  background-color: ${props => props.theme.text};
  position: relative;
  color: ${(props) => props.theme.body};
  overflow: hidden;
  margin-top: 100px; /* Adiciona uma margem superior para evitar sobreposição */

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const Title = styled.h1`
  font-size: ${(props) => props.theme.fontxxl};
  text-transform: uppercase;
  color: ${(props) => props.theme.body};
  
  margin: 1rem auto;
  border-bottom: 2px solid ${(props) => props.theme.carouselColor};
  width: fit-content;

  @media (max-width: 48em) {
    font-size: ${(props) => props.theme.fontxl};
  }
`;

const Container = styled.div`
  width: 75%;
  margin: 2rem auto;

  display: flex;
  justify-content: space-between;
  align-content: center;

  @media (max-width: 64em) {
    width: 80%;
  }
  @media (max-width: 48em) {
    width: 90%;
    flex-direction: column;

    &>*:last-child {
      &>*:first-child {
        margin-top: 0;
      }
    }
  }
`;
const Box = styled.div`
  width: 45%;
  @media (max-width: 64em) {
    width: 90%;
    align-self: center;
  }
`;

const Faq = () => {
  const ref = useRef(null);
  gsap.registerPlugin(ScrollTrigger);

  useLayoutEffect(() => {
    let element = ref.current;

    ScrollTrigger.create({
      trigger: element,
      start: 'bottom bottom',
      end: 'bottom top',
      pin: true,
      pinSpacing: false,
      scrub: 1,
      // markers: true,
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill()); // Limpa todos os triggers
    };
  }, []);

  return (
    <Section ref={ref} id="faq">
      <Title>Faq</Title>

      <Container>
        <Box>
          <Accordion ScrollTrigger={ScrollTrigger} title="O QUE É BLOCKCHAIN?">
            Blockchain é uma base de registro de informação imutável ou computacionalmente impraticável de reverter. Pode ser utilizada para registrar qualquer tipo de transação, evento ou dado de forma transparente, segura e descentralizada.
          </Accordion>
          <Accordion ScrollTrigger={ScrollTrigger} title=" QUAIS SÃO OS BENEFÍCIOS DA BLOCKCHAIN?">
            Alguns dos principais benefícios da blockchain incluem a descentralização, eliminando a necessidade de intermediários; segurança, devido à criptografia e à distribuição de dados; transparência, permitindo a verificação pública das transações; e eficiência, reduzindo custos e tempo de processamento.
          </Accordion>
          <Accordion ScrollTrigger={ScrollTrigger} title="O QUE É UM SMART CONTRACT?">
            Um smart contract é um protocolo de computador autoexecutável que facilita, verifica ou faz cumprir a negociação ou desempenho de um contrato, sem a necessidade de intermediários. Ele opera na blockchain e executa automaticamente os termos do contrato quando as condições predefinidas são atendidas.
          </Accordion>
        </Box>
        <Box>
          <Accordion ScrollTrigger={ScrollTrigger} title="O QUE SÃO CRÉDITOS DE CARBONO?">
            Os créditos de carbono são certificados que comprovam que a atividade de uma empresa ou um projeto de conservação ambiental evitou a emissão de 1 tonelada de dióxido de carbono ou gás carbônico (CO2), em determinado ano.
          </Accordion>
          <Accordion ScrollTrigger={ScrollTrigger} title="COMO GERAR CRÉDITOS DE CARBONO?">
            Temos diversas maneiras de gerar créditos de carbono, incluindo a substituição de combustíveis em fábricas por biomassas renováveis. Essa troca resulta na redução das emissões de gases de efeito estufa e na diminuição do desmatamento. Os créditos de carbono são calculados com base na diferença entre os dois cenários, indicando a quantidade de carbono que deixou de ser emitida devido a essa substituição.
          </Accordion>
          <Accordion ScrollTrigger={ScrollTrigger} title="O QUE É VERRA?">
            É a certificadora internacional de projetos de crédito de carbono que certifica nossos créditos e gera um 'serial number', que é o que dá esse lastro. É como se fosse um chassi. A Smart C02 pega esse serial number e ‘imprime’ ele dentro da blockchain, gerando o token.
          </Accordion>
        </Box>
      </Container>
    </Section>
  );
};

export default Faq;
