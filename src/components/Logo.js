import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Importe a imagem do logotipo
import logoImage from '../assets/logo.png';

const LogoText = styled.h1`
  font-family: 'Source Sans Pro', sans-serif;
  font-size: ${props => props.theme.fontlg};
  color: ${props => props.theme.text};
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  display: flex; /* Use flex para alinhar a imagem e o texto horizontalmente */
  align-items: center; /* Alinhe verticalmente ao centro */

  @media (max-width: 64em) {
    font-size: ${props => props.theme.fontxxl};
  }
`;

const LogoImage = styled.img`
  width: 23px; /* Tamanho padrão */
  height: 32px; /* Tamanho padrão */
  margin-right: 1px; /* Adicione margem à direita para separar a imagem do texto */
  transition: all 0.2s ease;

  @media (max-width: 768px) {
    width: 33px; /* Dobro do tamanho */
    height: 51px; /* Dobro do tamanho */
  }
`;

const LogoTextSpan = styled.span`
  @media (max-width: 768px) {
    display: none; /* Esconder o texto quando a largura da tela for menor que 768px */
  }
`;

const Logo = () => {
  return (
    <LogoText>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <LogoImage src={logoImage} alt="Logo" />
        <LogoTextSpan>Smart CO2</LogoTextSpan>
      </Link>
    </LogoText>
  );
}

export default Logo;
