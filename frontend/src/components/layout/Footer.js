// src/components/layout/Footer.js
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterWrapper>
      <Container>
        <TopSection>
          <LogoSection>
            <Logo>
              <LogoIcon>N</LogoIcon>
              <LogoText>Neurointerview</LogoText>
            </Logo>
            <Tagline>
              Equitable technical interviews for neurodivergent engineers.
            </Tagline>
          </LogoSection>

          <LinksSection>
            <LinkColumn>
              <ColumnTitle>Platform</ColumnTitle>
              <FooterLink to="/about">About</FooterLink>
              <FooterLink to="/features">Features</FooterLink>
              <FooterLink to="/pricing">Pricing</FooterLink>
            </LinkColumn>

            <LinkColumn>
              <ColumnTitle>Resources</ColumnTitle>
              <FooterLink to="/blog">Blog</FooterLink>
              <FooterLink to="/faq">FAQ</FooterLink>
              <FooterLink to="/support">Support</FooterLink>
            </LinkColumn>

            <LinkColumn>
              <ColumnTitle>Legal</ColumnTitle>
              <FooterLink to="/privacy">Privacy</FooterLink>
              <FooterLink to="/terms">Terms</FooterLink>
              <FooterLink to="/accessibility">Accessibility</FooterLink>
            </LinkColumn>
          </LinksSection>
        </TopSection>

        <Divider />

        <BottomSection>
          <Copyright>
            © {currentYear} Neurointerview. All rights reserved.
          </Copyright>
        </BottomSection>
      </Container>
    </FooterWrapper>
  );
};

// Styled Components
const FooterWrapper = styled.footer`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 3rem 0 1.5rem;
  margin-top: auto;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const TopSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const LogoSection = styled.div`
  max-width: 300px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const LogoIcon = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  border-radius: 6px;
`;

const LogoText = styled.span`
  font-weight: 700;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const Tagline = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 0.5rem;
`;

const LinksSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: 2rem;
  }
`;

const LinkColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ColumnTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.9rem;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Divider = styled.hr`
  border: 0;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
  margin: 2rem 0;
`;

const BottomSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Copyright = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.875rem;
  margin: 0;
`;

export default Footer;