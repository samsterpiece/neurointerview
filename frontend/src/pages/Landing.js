// src/pages/Landing.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiCheck, FiUsers, FiPieChart, FiCpu, FiBriefcase } from 'react-icons/fi';

// Import hero image
import heroImage from '../assets/hero-image.svg';

const Landing = () => {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection>
        <HeroContainer>
          <HeroContent>
            <HeroTitle>Equitable Technical Interviews for Neurodivergent Engineers</HeroTitle>
            <HeroSubtitle>
              Neurointerview provides a customizable platform that adapts to neurodivergent needs, ensuring your technical skills shine through without common interview barriers.
            </HeroSubtitle>
            <HeroButtons>
              <PrimaryButton to="/register">Get Started</PrimaryButton>
              <SecondaryButton to="/about">Learn More</SecondaryButton>
            </HeroButtons>
          </HeroContent>
          <HeroImageContainer>
            <img src={heroImage} alt="Neurointerview platform illustration" />
          </HeroImageContainer>
        </HeroContainer>
      </HeroSection>

      {/* Features Section */}
      <FeaturesSection>
        <SectionContainer>
          <SectionTitle>Designed for Neurodivergent Engineers</SectionTitle>
          <SectionSubtitle>
            Our platform offers personalized accommodations tailored to various neurodivergent profiles
          </SectionSubtitle>

          <FeaturesGrid>
            <FeatureCard>
              <FeatureIconContainer>
                <FiUsers size={28} />
              </FeatureIconContainer>
              <FeatureTitle>ADHD Accommodations</FeatureTitle>
              <FeatureDescription>
                Segmented interview sessions with integrated breaks and distraction management tools.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIconContainer>
                <FiCpu size={28} />
              </FeatureIconContainer>
              <FeatureTitle>Autism-Friendly Structure</FeatureTitle>
              <FeatureDescription>
                Clear instructions, predictable formats, and literal language optimized for clarity.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIconContainer>
                <FiPieChart size={28} />
              </FeatureIconContainer>
              <FeatureTitle>Social Anxiety Support</FeatureTitle>
              <FeatureDescription>
                Text-based communication options and reduced social pressure interview formats.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIconContainer>
                <FiBriefcase size={28} />
              </FeatureIconContainer>
              <FeatureTitle>Real-World Problems</FeatureTitle>
              <FeatureDescription>
                Focus on actual job skills rather than algorithmic trick questions and puzzles.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </SectionContainer>
      </FeaturesSection>

      {/* For Companies Section */}
      <CompaniesSection>
        <SectionContainer>
          <SectionTitle>For Employers</SectionTitle>
          <SectionSubtitle>
            Expand your talent pool by accessing exceptional neurodivergent engineers
          </SectionSubtitle>

          <CompaniesContent>
            <CompaniesImageContainer>
              {/* Placeholder for company-focused illustration */}
              <div className="placeholder-image" />
            </CompaniesImageContainer>

            <CompaniesFeatures>
              <CompanyFeature>
                <FeatureCheckIcon>
                  <FiCheck size={20} />
                </FeatureCheckIcon>
                <div>
                  <CompanyFeatureTitle>Diverse Talent Pool</CompanyFeatureTitle>
                  <CompanyFeatureText>
                    Access qualified candidates who may struggle with traditional interviews but excel at actual job skills.
                  </CompanyFeatureText>
                </div>
              </CompanyFeature>

              <CompanyFeature>
                <FeatureCheckIcon>
                  <FiCheck size={20} />
                </FeatureCheckIcon>
                <div>
                  <CompanyFeatureTitle>Reduce False Negatives</CompanyFeatureTitle>
                  <CompanyFeatureText>
                    Stop missing exceptional engineers due to interview format issues rather than skill deficiencies.
                  </CompanyFeatureText>
                </div>
              </CompanyFeature>

              <CompanyFeature>
                <FeatureCheckIcon>
                  <FiCheck size={20} />
                </FeatureCheckIcon>
                <div>
                  <CompanyFeatureTitle>Meaningful Assessments</CompanyFeatureTitle>
                  <CompanyFeatureText>
                    Evaluate candidates based on real-world problems that actually reflect job requirements.
                  </CompanyFeatureText>
                </div>
              </CompanyFeature>

              <CompanyFeature>
                <FeatureCheckIcon>
                  <FiCheck size={20} />
                </FeatureCheckIcon>
                <div>
                  <CompanyFeatureTitle>Inclusive Reputation</CompanyFeatureTitle>
                  <CompanyFeatureText>
                    Demonstrate your commitment to diversity and inclusion with neurodiversity support.
                  </CompanyFeatureText>
                </div>
              </CompanyFeature>

              <CompanyCTA to="/register">Create Company Account</CompanyCTA>
            </CompaniesFeatures>
          </CompaniesContent>
        </SectionContainer>
      </CompaniesSection>

      {/* Testimonials Section */}
      <TestimonialsSection>
        <SectionContainer>
          <SectionTitle>What People Are Saying</SectionTitle>

          <TestimonialsGrid>
            <TestimonialCard>
              <TestimonialQuote>
                "Neurointerview helped me showcase my actual coding abilities without the usual anxiety of technical interviews. I could take breaks when needed and the interface adapts to my preferences."
              </TestimonialQuote>
              <TestimonialAuthor>
                <strong>Alex T.</strong> - Software Engineer with ADHD
              </TestimonialAuthor>
            </TestimonialCard>

            <TestimonialCard>
              <TestimonialQuote>
                "As someone on the autism spectrum, traditional interviews were always challenging. With Neurointerview, I could demonstrate my pattern recognition strengths without social barriers."
              </TestimonialQuote>
              <TestimonialAuthor>
                <strong>Jamie K.</strong> - Backend Developer
              </TestimonialAuthor>
            </TestimonialCard>

            <TestimonialCard>
              <TestimonialQuote>
                "We've expanded our engineering team with incredible talent we might have missed using traditional interviews. The platform helps us focus on what matters - can they solve real problems?"
              </TestimonialQuote>
              <TestimonialAuthor>
                <strong>Sarah M.</strong> - Engineering Director
              </TestimonialAuthor>
            </TestimonialCard>
          </TestimonialsGrid>
        </SectionContainer>
      </TestimonialsSection>

      {/* CTA Section */}
      <CTASection>
        <SectionContainer>
          <CTAContent>
            <CTATitle>Ready to Transform Your Technical Interviews?</CTATitle>
            <CTAText>
              Join Neurointerview today and create a more equitable hiring process.
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
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 4rem 0;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 6rem 0;
  }
`;

const HeroContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: row;
    align-items: center;
  }
`;

const HeroContent = styled.div`
  flex: 1;
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.primary};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 3rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.textLight};
  max-width: 600px;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const PrimaryButton = styled(Link)`
  display: inline-block;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
    color: white;
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-block;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;

const HeroImageContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  
  img {
    max-width: 100%;
    height: auto;
  }
`;

const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.heading};
`;

const SectionSubtitle = styled.p`
  font-size: 1.125rem;
  text-align: center;
  max-width: 700px;
  margin: 0 auto 3rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const FeaturesSection = styled.section`
  padding: 5rem 0;
  background-color: white;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const FeatureCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const FeatureIconContainer = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(37, 99, 235, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.heading};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.95rem;
  line-height: 1.6;
`;

const CompaniesSection = styled.section`
  padding: 5rem 0;
  background-color: ${({ theme }) => theme.colors.surface};
`;

const CompaniesContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: row;
    align-items: center;
  }
`;

const CompaniesImageContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  
  .placeholder-image {
    width: 100%;
    max-width: 500px;
    height: 400px;
    background-color: #e2e8f0;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
  }
`;

const CompaniesFeatures = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CompanyFeature = styled.div`
  display: flex;
  gap: 1rem;
`;

const FeatureCheckIcon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgba(37, 99, 235, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

const CompanyFeatureTitle = styled.h4`
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.heading};
`;

const CompanyFeatureText = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.95rem;
  line-height: 1.6;
`;

const CompanyCTA = styled(Link)`
  display: inline-block;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: background-color 0.2s ease;
  margin-top: 1rem;
  align-self: flex-start;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
    color: white;
  }
`;

const TestimonialsSection = styled.section`
  padding: 5rem 0;
  background-color: white;
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const TestimonialCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const TestimonialQuote = styled.blockquote`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1.5rem;
  position: relative;
  
  &:before {
    content: '"';
    font-size: 3rem;
    color: ${({ theme }) => theme.colors.primaryLight};
    opacity: 0.3;
    position: absolute;
    top: -1.5rem;
    left: -0.5rem;
  }
`;

const TestimonialAuthor = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.9rem;
  margin: 0;
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

export default Landing;