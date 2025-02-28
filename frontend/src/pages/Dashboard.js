// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { assessmentService } from '../services/assessmentService';

// Icons
import {
  FiClock, FiCheckCircle, FiAlertTriangle, FiCalendar,
  FiArrowRight, FiFilter, FiSearch, FiStar, FiBriefcase
} from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [assessments, setAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setIsLoading(true);
        const data = await assessmentService.getCandidateAssessments();
        setAssessments(data);
      } catch (err) {
        setError('Failed to load assessments. Please try again later.');
        console.error('Error fetching assessments:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  // Filter assessments by status and search query
  const filteredAssessments = assessments.filter(assessment => {
    const matchesStatus = filterStatus === 'all' || assessment.status === filterStatus;
    const matchesSearch = assessment.assessment_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assessment.company_name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Get counts for status badges
  const getStatusCounts = () => {
    const counts = {
      invited: 0,
      started: 0,
      completed: 0,
      expired: 0
    };

    assessments.forEach(assessment => {
      if (counts.hasOwnProperty(assessment.status)) {
        counts[assessment.status]++;
      }
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  // Handle starting an assessment
  const handleStartAssessment = async (assessmentId) => {
    try {
      await assessmentService.startCandidateAssessment(assessmentId);
      navigate(`/assessment/${assessmentId}`);
    } catch (err) {
      console.error('Error starting assessment:', err);
      setError('Failed to start assessment. Please try again.');
    }
  };

  // Get status icon and color
  const getStatusInfo = (status) => {
    switch (status) {
      case 'invited':
        return { icon: <FiCalendar />, color: '#3b82f6', label: 'Invited' };
      case 'started':
        return { icon: <FiClock />, color: '#f59e0b', label: 'In Progress' };
      case 'completed':
        return { icon: <FiCheckCircle />, color: '#10b981', label: 'Completed' };
      case 'expired':
        return { icon: <FiAlertTriangle />, color: '#ef4444', label: 'Expired' };
      default:
        return { icon: <FiCalendar />, color: '#6b7280', label: status };
    }
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <WelcomeSection>
          <Title>Welcome back, {user?.first_name || 'Candidate'}</Title>
          <Subtitle>Manage your technical assessments</Subtitle>
        </WelcomeSection>

        <StatCards>
          <StatCard>
            <StatCardTitle>Pending</StatCardTitle>
            <StatCardValue>{statusCounts.invited}</StatCardValue>
            <StatCardIcon color="#3b82f6">
              <FiCalendar size={20} />
            </StatCardIcon>
          </StatCard>

          <StatCard>
            <StatCardTitle>In Progress</StatCardTitle>
            <StatCardValue>{statusCounts.started}</StatCardValue>
            <StatCardIcon color="#f59e0b">
              <FiClock size={20} />
            </StatCardIcon>
          </StatCard>

          <StatCard>
            <StatCardTitle>Completed</StatCardTitle>
            <StatCardValue>{statusCounts.completed}</StatCardValue>
            <StatCardIcon color="#10b981">
              <FiCheckCircle size={20} />
            </StatCardIcon>
          </StatCard>

          <StatCard>
            <StatCardTitle>Profile Strength</StatCardTitle>
            <StatCardValue>80%</StatCardValue>
            <StatCardIcon color="#8b5cf6">
              <FiStar size={20} />
            </StatCardIcon>
          </StatCard>
        </StatCards>
      </DashboardHeader>

      <ContentSection>
        <ContentHeader>
          <ContentTitle>Your Assessments</ContentTitle>

          <FilterControls>
            <SearchInput
              type="text"
              placeholder="Search by company or assessment name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefix={<FiSearch size={16} />}
            />

            <FilterSelect
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              icon={<FiFilter size={16} />}
            >
              <option value="all">All Statuses</option>
              <option value="invited">Invited</option>
              <option value="started">In Progress</option>
              <option value="completed">Completed</option>
              <option value="expired">Expired</option>
            </FilterSelect>
          </FilterControls>
        </ContentHeader>

        {isLoading ? (
          <LoadingMessage>Loading your assessments...</LoadingMessage>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : filteredAssessments.length === 0 ? (
          <EmptyState>
            <EmptyStateTitle>No assessments found</EmptyStateTitle>
            <EmptyStateMessage>
              {searchQuery || filterStatus !== 'all'
                ? 'Try adjusting your filters or search query'
                : 'You have no assessments yet. They will appear here when companies invite you.'}
            </EmptyStateMessage>
          </EmptyState>
        ) : (
          <AssessmentsList>
            {filteredAssessments.map((assessment) => {
              const statusInfo = getStatusInfo(assessment.status);

              return (
                <AssessmentCard key={assessment.id}>
                  <AssessmentCardContent>
                    <CompanyInfo>
                      <CompanyLogo>
                        {assessment.company_name.charAt(0)}
                      </CompanyLogo>
                      <div>
                        <CompanyName>{assessment.company_name}</CompanyName>
                        <AssessmentTitle>{assessment.assessment_title}</AssessmentTitle>
                      </div>
                    </CompanyInfo>

                    <AssessmentMeta>
                      <AssessmentMetaItem>
                        <FiBriefcase size={16} />
                        <span>Software Engineer</span>
                      </AssessmentMetaItem>
                      <AssessmentMetaItem>
                        <FiClock size={16} />
                        <span>60 minutes</span>
                      </AssessmentMetaItem>
                    </AssessmentMeta>

                    <AssessmentStatus color={statusInfo.color}>
                      {statusInfo.icon}
                      <span>{statusInfo.label}</span>
                    </AssessmentStatus>

                    <AssessmentActions>
                      {assessment.status === 'invited' && (
                        <StartButton
                          onClick={() => handleStartAssessment(assessment.id)}
                        >
                          Start Assessment
                          <FiArrowRight size={16} />
                        </StartButton>
                      )}

                      {assessment.status === 'started' && (
                        <ContinueButton
                          onClick={() => navigate(`/assessment/${assessment.id}`)}
                        >
                          Continue
                          <FiArrowRight size={16} />
                        </ContinueButton>
                      )}

                      {assessment.status === 'completed' && (
                        <ViewResultsButton
                          onClick={() => navigate(`/assessment/${assessment.id}/results`)}
                        >
                          View Results
                          <FiArrowRight size={16} />
                        </ViewResultsButton>
                      )}

                      {assessment.status === 'expired' && (
                        <ExpiredMessage>
                          This assessment has expired
                        </ExpiredMessage>
                      )}
                    </AssessmentActions>
                  </AssessmentCardContent>
                </AssessmentCard>
              );
            })}
          </AssessmentsList>
        )}
      </ContentSection>

      <ProfileSection>
        <ContentHeader>
          <ContentTitle>Your Neurodivergent Profile</ContentTitle>
          <UpdateProfileButton to="/profile">
            Update Profile
          </UpdateProfileButton>
        </ContentHeader>

        <ProfileCard>
          <ProfileCardContent>
            <div>
              <ProfileCardTitle>Interview Accommodations</ProfileCardTitle>
              <ProfileCardDescription>
                These settings will be applied to all your technical interviews
              </ProfileCardDescription>
            </div>

            <ProfileSettings>
              <ProfileSettingRow>
                <ProfileSettingLabel>Extended Time</ProfileSettingLabel>
                <ProfileSettingToggle
                  active={user?.prefers_extra_time}
                  disabled
                />
              </ProfileSettingRow>

              <ProfileSettingRow>
                <ProfileSettingLabel>Segmented Sessions</ProfileSettingLabel>
                <ProfileSettingToggle
                  active={user?.prefers_segmented_sessions}
                  disabled
                />
              </ProfileSettingRow>

              <ProfileSettingRow>
                <ProfileSettingLabel>Text Communication</ProfileSettingLabel>
                <ProfileSettingToggle
                  active={user?.prefers_text_communication}
                  disabled
                />
              </ProfileSettingRow>

              <ProfileSettingRow>
                <ProfileSettingLabel>Visual Aids</ProfileSettingLabel>
                <ProfileSettingToggle
                  active={user?.prefers_visual_aids}
                  disabled
                />
              </ProfileSettingRow>

              <ProfileSettingRow>
                <ProfileSettingLabel>Literal Language</ProfileSettingLabel>
                <ProfileSettingToggle
                  active={user?.prefers_literal_language}
                  disabled
                />
              </ProfileSettingRow>

              <ProfileSettingRow>
                <ProfileSettingLabel>Dyslexic Formatting</ProfileSettingLabel>
                <ProfileSettingToggle
                  active={user?.prefers_dyslexia_formatting}
                  disabled
                />
              </ProfileSettingRow>
            </ProfileSettings>
          </ProfileCardContent>
        </ProfileCard>
      </ProfileSection>
    </DashboardContainer>
  );
};

// Styled Components
const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const DashboardHeader = styled.div`
  margin-bottom: 2rem;
`;

const WelcomeSection = styled.div`
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  color: ${({ theme }) => theme.colors.heading};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const StatCards = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  position: relative;
  overflow: hidden;
`;

const StatCardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 0.5rem;
`;

const StatCardValue = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.heading};
`;

const StatCardIcon = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  color: ${({ color }) => color || '#6b7280'};
  opacity: 0.8;
`;

const ContentSection = styled.section`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const ContentTitle = styled.h2`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.heading};
  margin: 0;
`;

const FilterControls = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  min-width: 250px;
  background-color: white;
  position: relative;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
  
  ${({ prefix }) => prefix && `
    background-position: 0.75rem center;
    background-repeat: no-repeat;
    padding-left: 2.5rem;
  `}
`;

const FilterSelect = styled.select`
  padding: 0.5rem 2rem 0.5rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  background-color: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
  
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem 0;
  color: ${({ theme }) => theme.colors.textLight};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.danger};
  background-color: #fef2f2;
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 0;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.heading};
  margin-bottom: 0.5rem;
`;

const EmptyStateMessage = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  max-width: 400px;
  margin: 0 auto;
`;

const AssessmentsList = styled.div`
  display: grid;
  gap: 1rem;
`;

const AssessmentCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.borderDark};
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

const AssessmentCardContent = styled.div`
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const CompanyInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CompanyLogo = styled.div`
  width: 50px;
  height: 50px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 500;
`;

const CompanyName = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 0.25rem;
`;

const AssessmentTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.heading};
`;

const AssessmentMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: row;
    gap: 1rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
  }
`;

const AssessmentMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.875rem;
`;

const AssessmentStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ color }) => color || '#6b7280'};
  font-weight: 500;
  font-size: 0.875rem;
`;

const AssessmentActions = styled.div`
  display: flex;
  justify-content: flex-end;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: flex-start;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
`;

const StartButton = styled(ActionButton)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const ContinueButton = styled(ActionButton)`
  background-color: ${({ theme }) => theme.colors.warning};
  color: white;
  
  &:hover {
    background-color: #d97706;
  }
`;

const ViewResultsButton = styled(ActionButton)`
  background-color: ${({ theme }) => theme.colors.success};
  color: white;
  
  &:hover {
    background-color: #059669;
  }
`;

const ExpiredMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.875rem;
  font-weight: 500;
`;

const ProfileSection = styled.section`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const UpdateProfileButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(37, 99, 235, 0.05);
  }
`;

const ProfileCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
`;

const ProfileCardContent = styled.div`
  padding: 1.5rem;
`;

const ProfileCardTitle = styled.h3`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.heading};
  margin-bottom: 0.5rem;
`;

const ProfileCardDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
`;

const ProfileSettings = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ProfileSettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const ProfileSettingLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};
`;

const ProfileSettingToggle = styled.div`
  width: 40px;
  height: 20px;
  background-color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.border};
  border-radius: 10px;
  position: relative;
  transition: background-color 0.2s ease;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ disabled }) => disabled ? 0.7 : 1};
  
  &:after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: white;
    top: 2px;
    left: ${({ active }) => active ? '22px' : '2px'};
    transition: left 0.2s ease;
  }
`;

export default Dashboard;