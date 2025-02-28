// src/pages/About.js
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiTarget, FiCheckCircle, FiClock, FiUsers } from 'react-icons/fi';

// Placeholder founder image
import founderImage from '../assets/founder-placeholder.jpg';

const About = () => {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection>
        <HeroContainer>
          <HeroTitle>About Neurointerview</HeroTitle>
          <HeroSubtitle>
            Transforming technical interviews for neurodivergent engineers
          </HeroSubtitle>
        </HeroContainer>
      </HeroSection>

      {/* Mission Section */}
      <MissionSection>
        <SectionContainer>
          <SectionTitle>Our Mission</SectionTitle>
          <MissionContent>
            <MissionText>
              <p>
                At Neurointerview, we believe that traditional technical interviews put neurodivergent
                engineers at a significant disadvantage, filtering out exceptional talent before they
                can showcase their true abilities.
              </p>
              <p>
                Our mission is to level the playing field by providing a technical assessment platform
                specifically designed to accommodate the needs of engineers with ADHD, autism,
                social anxiety, dyslexia, and other neurodivergent profiles.
              </p>
              <p>
                We're dedicated to helping companies discover incredible engineering talent while
                giving neurodivergent candidates the opportunity to demonstrate their skills in an
                environment that works with their strengths rather than against them.
              </p>
            </MissionText>
            <MissionValues>
              <ValueItem>
                <ValueIcon>
                  <FiTarget size={24} />
                </ValueIcon>
                <ValueTitle>Equity</ValueTitle>
                <ValueDescription>
                  Creating fair opportunities through accommodations, not lowering standards
                </ValueDescription>
              </ValueItem>
              <ValueItem>
                <ValueIcon>
                  <FiCheckCircle size={24} />
                </ValueIcon>
                <ValueTitle>Authenticity</ValueTitle>
                <ValueDescription>
                  Allowing candidates to showcase their true abilities without masking
                </ValueDescription>
              </ValueItem>
              <ValueItem>
                <ValueIcon>
                  <FiClock size={24} />
                </ValueIcon>
                <ValueTitle>Flexibility</ValueTitle>
                <ValueDescription>
                  Adapting processes to diverse cognitive styles and needs
                </ValueDescription>
              </ValueItem>
              <ValueItem>
                <ValueIcon>
                  <FiUsers size={24} />
                </ValueIcon>
                <ValueTitle>Inclusion</ValueTitle>
                <ValueDescription>
                  Embracing neurodiversity as a competitive advantage
                </ValueDescription>
              </ValueItem>
            </MissionValues>
          </MissionContent>
        </SectionContainer>
      </MissionSection>

      {/* Founder's Story Section */}
      <FounderSection>
        <SectionContainer>
          <SectionTitle>Founder's Story</SectionTitle>
          <FounderContent>
            <FounderImageContainer>
              <FounderImage src={founderImage} alt="Founder of Neurointerview" />
            </FounderImageContainer>
            <FounderStory>
              <p>
                In 2019, I was rejected from yet another dream engineering role after struggling
                through a whiteboard interview. Despite having built complex systems and shipped
                production code for years, I found myself unable to perform under the pressure and
                constraints of traditional technical interviews.
              </p>
              <p>
                As someone with ADHD and social anxiety, I knew my brain worked differently.
                The environment of technical interviews—with their time pressure, unfamiliar
                settings, and high-stakes social evaluation—created the perfect storm of
                conditions where my neurodivergent traits became barriers rather than strengths.
              </p>
              <p>
                After speaking with hundreds of neurodivergent engineers with similar experiences,
                I realized this wasn't a personal failing but a systemic issue. The standard
                technical interview process was filtering out talented developers not based on
                coding ability, but on how well they performed under conditions that are
                particularly challenging for neurodivergent individuals.
              </p>
              <p>
                I created Neurointerview to solve this problem—to build a platform that maintains high
                standards for technical assessment while accommodating different neurotypes.
                Our goal isn't to lower the bar, but to ensure everyone has an equal opportunity
                to reach it.
              </p>
              <FounderSignature>
                - [Founder Name], Founder & CEO
              </FounderSignature>
            </FounderStory>
          </FounderContent>
        </SectionContainer>
      </FounderSection>

      {/* How It Works Section */}
      <HowItWorksSection>
        <SectionContainer>
          <SectionTitle>How It Works</SectionTitle>
          <ProcessSteps>
            <ProcessStep>
              <StepNumber>1</StepNumber>
              <StepContent>
                <StepTitle>Identify Your Needs</StepTitle>
                <StepDescription>
                  Tell us about your neurodivergent profile and specific needs for an optimal interview experience.
                </StepDescription>
              </StepContent>
            </ProcessStep>
            <ProcessStep>
              <StepNumber>2</StepNumber>
              <StepContent>
                <StepTitle>Customized Interface</StepTitle>
                <StepDescription>
                  Our platform adapts to your preferences with tools specifically designed for your neurotype.
                </StepDescription>
              </StepContent>
            </ProcessStep>
            <ProcessStep>
              <StepNumber>3</StepNumber>
              <StepContent>
                <StepTitle>Real-World Challenges</StepTitle>
                <StepDescription>
                  Tackle actual engineering problems that demonstrate your problem-solving abilities.
                </StepDescription>
              </StepContent>
            </ProcessStep>
            <ProcessStep>
              <StepNumber>4</StepNumber>
              <StepContent>
                <StepTitle>Showcase Your Skills</StepTitle>
                <StepDescription>
                  Companies review your work based on your skills, not your ability to interview.
                </StepDescription>
              </StepContent>
            </ProcessStep>
          </ProcessSteps>
        </SectionContainer>
      </HowItWorksSection>

      {/* CTA Section */}
      <CTASection>
        <SectionContainer>
          <CTAContent>
            <CTATitle>Ready to Experience Better Technical Interviews?</CTATitle>
            <CTAText>
              Join thousands of neurodivergent engineers who have discovered a better way to showcase their skills.
            </CTAText>
            <CTAButtons>
              <PrimaryButton to="/register">Sign Up Now</PrimaryButton>
              <SecondaryButton to="/contact">Contact Us</SecondaryButton>
            </CTAButtons>
          </CTAContent>
        </SectionContainer>
      </CTASection>
    </div>
  );
};

// Styled Components
const HeroSection = styled.section`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 5rem 0;
  text-align: center;
  color: white;
`;

const HeroContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1.5rem;
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  opacity: 0.9;
`;

const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 3rem;
  color: ${({ theme }) => theme.colors.heading};
`;

const MissionSection = styled.section`
  padding: 5rem 0;
  background-color: white;
`;

const MissionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: row;
  }
`;

const MissionText = styled.div`
  flex: 1;
  
  p {
    margin-bottom: 1.5rem;
    line-height: 1.7;
    color: ${({ theme }) => theme.colors.text};
  }
  
  p:last-child {
    margin-bottom: 0;
  }
`;

const MissionValues = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ValueItem = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const ValueIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
`;

const ValueTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.heading};
`;

const ValueDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.95rem;
  line-height: 1.6;
`;

const FounderSection = styled.section`
  padding: 5rem 0;
  background-color: ${({ theme }) => theme.colors.surface};
`;

const FounderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const FounderImageContainer = styled.div`
  flex: 1;
  max-width: 400px;
  margin: 0 auto;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin: 0;
  }
`;

const FounderImage = styled.img`
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const FounderStory = styled.div`
  flex: 2;
  
  p {
    margin-bottom: 1.5rem;
    line-height: 1.7;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const FounderSignature = styled.p`
  font-style: italic;
  font-weight: 500;
  margin-top: 2rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const HowItWorksSection = styled.section`
  padding: 5rem 0;
  background-color: white;
`;

const ProcessSteps = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const ProcessStep = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const StepNumber = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  flex-shrink: 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 0 auto;
  }
`;

const StepContent = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    text-align: center;
  }
`;

const StepTitle = styled.h3`
  font-size: 1.35rem;
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.colors.heading};
`;

const StepDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.6;
`;

const CTASection = styled.section`
  padding: 5rem 0;
  background-color: ${({ theme }) => theme.colors.primary};
`;

const CTAContent = styled.div`
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
`;

const CTATitle = styled.h2`
  font-size: 2rem;
  color: white;
  margin-bottom: 1rem;
`;

const CTAText = styled.p`
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
`;

const CTAButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const PrimaryButton = styled(Link)`
  display: inline-block;
  background-color: white;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-block;
  background-color: transparent;
  color: white;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid white;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export default About;