// src/pages/Assessment.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { assessmentService } from '../services/assessmentService';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';

// Components
import { FiClock, FiCheckCircle, FiSend, FiPlayCircle, FiPauseCircle, FiSettings, FiAlertCircle } from 'react-icons/fi';

const Assessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [assessment, setAssessment] = useState(null);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [showAccommodationsPanel, setShowAccommodationsPanel] = useState(false);
  const [accommodationsUsed, setAccommodationsUsed] = useState({
    extendedTime: false,
    breaksTaken: 0,
    customEnvironment: {}
  });

  // Load assessment data
  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setIsLoading(true);
        const data = await assessmentService.getCandidateAssessmentById(id);
        setAssessment(data);

        // Set the first problem as the current problem
        if (data.problems && data.problems.length > 0) {
          const problemData = await assessmentService.getProblemById(data.problems[0].id);
          setCurrentProblem(problemData);

          // Set default code based on the problem
          setCode(getStarterCode(problemData));
        }

        // Set time remaining
        const remainingTime = calculateRemainingTime(data);
        setTimeRemaining(remainingTime);

      } catch (err) {
        setError('Failed to load assessment. Please try again later.');
        console.error('Error fetching assessment:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessment();
  }, [id]);

  // Timer logic
  useEffect(() => {
    if (!timeRemaining || isPaused) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isPaused]);

  // Helper to calculate remaining time
  const calculateRemainingTime = (assessmentData) => {
    if (!assessmentData) return 0;

    const timeLimit = assessmentData.assessment?.time_limit || 60; // Default 60 min
    const extendedTime = assessmentData.time_extended || 0;
    const totalTimeInMinutes = timeLimit + extendedTime;

    // Calculate remaining time based on started_at
    if (assessmentData.started_at) {
      const startTime = new Date(assessmentData.started_at).getTime();
      const currentTime = new Date().getTime();
      const timeElapsed = (currentTime - startTime) / 1000 / 60; // in minutes

      const remaining = totalTimeInMinutes - timeElapsed;
      return Math.max(0, Math.round(remaining * 60)); // Convert to seconds
    }

    return totalTimeInMinutes * 60; // Convert to seconds
  };

  // Helper to get starter code
  const getStarterCode = (problem) => {
    if (!problem) return '';

    // Return language specific starter code or default
    if (problem.starter_code && problem.starter_code[language]) {
      return problem.starter_code[language];
    }

    // Default starter code by language
    switch (language) {
      case 'javascript':
        return `function solution() {\n  // Your code here\n}\n`;
      case 'python':
        return `def solution():\n    # Your code here\n    pass\n`;
      case 'java':
        return `class Solution {\n  public static void main(String[] args) {\n    // Your code here\n  }\n}\n`;
      default:
        return '// Your solution here';
    }
  };

  // Handle time up
  const handleTimeUp = async () => {
    try {
      // Auto-submit
      await assessmentService.submitCandidateAssessment(id);
      navigate('/dashboard', { state: { message: 'Assessment time expired and was submitted automatically.' } });
    } catch (err) {
      console.error('Error submitting assessment:', err);
    }
  };

  // Handle pause/break
  const handlePauseAssessment = async () => {
    setIsPaused(!isPaused);

    if (!isPaused) {
      // Record break start
      try {
        await assessmentService.takeBreak(id, { duration: 5 });
        setAccommodationsUsed(prev => ({
          ...prev,
          breaksTaken: prev.breaksTaken + 1
        }));
      } catch (err) {
        console.error('Error recording break:', err);
      }
    }
  };

  // Handle request time extension
  const handleRequestExtension = async () => {
    try {
      const requestedMinutes = 15; // Default extension time
      await assessmentService.requestExtension(id, { minutes: requestedMinutes });

      // Update local state
      setTimeRemaining(prev => prev + (requestedMinutes * 60));
      setAccommodationsUsed(prev => ({
        ...prev,
        extendedTime: true
      }));

      // Show success message
      // ...
    } catch (err) {
      console.error('Error requesting extension:', err);
      // Show error message
      // ...
    }
  };

  // Handle language change
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setCode(getStarterCode(currentProblem));
  };

  // Handle code change
  const handleCodeChange = (value) => {
    setCode(value);
  };

  // Handle run code
  const handleRunCode = async () => {
    setIsRunning(true);
    setTestResults(null);

    try {
      // Call API to run code against visible test cases
      const results = await assessmentService.runCode({
        candidateAssessmentId: id,
        problemId: currentProblem.id,
        code,
        language
      });

      setTestResults(results);
    } catch (err) {
      console.error('Error running code:', err);
      setTestResults({
        error: err.message || 'Failed to run code. Please try again.'
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Handle submit solution
  const handleSubmitSolution = async () => {
    if (!window.confirm('Are you sure you want to submit this solution? This action cannot be undone.')) {
      return;
    }

    setIsRunning(true);

    try {
      // Submit solution
      const result = await assessmentService.submitSolution({
        candidateAssessmentId: id,
        problemId: currentProblem.id,
        code,
        language
      });

      // If this is the last problem, complete the assessment
      if (!assessment.problems || assessment.problems.length <= 1) {
        await assessmentService.submitCandidateAssessment(id);
        navigate('/dashboard', {
          state: { message: 'Assessment completed successfully!' }
        });
      } else {
        // Otherwise move to the next problem
        // This is simplified - in a real app you'd keep track of which problems are completed
        // and navigate between them
        setTestResults(result);

        // Show success message
        // ...
      }
    } catch (err) {
      console.error('Error submitting solution:', err);
      // Show error message
      // ...
    } finally {
      setIsRunning(false);
    }
  };

  // Format time
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingMessage>Loading assessment...</LoadingMessage>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <ErrorMessage>{error}</ErrorMessage>
        <BackButton onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </BackButton>
      </ErrorContainer>
    );
  }

  if (!assessment || !currentProblem) {
    return (
      <ErrorContainer>
        <ErrorMessage>Assessment not found or no problems available.</ErrorMessage>
        <BackButton onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </BackButton>
      </ErrorContainer>
    );
  }

  return (
    <AssessmentContainer neurodivergentProfile={user?.is_adhd ? 'adhd' : (user?.is_asd ? 'asd' : '')}>
      <AssessmentHeader>
        <AssessmentTitle>
          {assessment.assessment_title} - {currentProblem.title}
        </AssessmentTitle>

        <AssessmentControls>
          <TimeDisplay isPaused={isPaused} isLow={timeRemaining < 300}>
            <FiClock size={18} />
            <span>{formatTime(timeRemaining)}</span>
          </TimeDisplay>

          <ControlButton
            onClick={handlePauseAssessment}
            color={isPaused ? '#f59e0b' : '#6b7280'}
          >
            {isPaused ? <FiPlayCircle size={18} /> : <FiPauseCircle size={18} />}
            <span>{isPaused ? 'Resume' : 'Take Break'}</span>
          </ControlButton>

          <ControlButton
            onClick={() => setShowAccommodationsPanel(!showAccommodationsPanel)}
            color="#6b7280"
          >
            <FiSettings size={18} />
            <span>Accommodations</span>
          </ControlButton>
        </AssessmentControls>
      </AssessmentHeader>

      {showAccommodationsPanel && (
        <AccommodationsPanel>
          <AccommodationsPanelHeader>
            <h3>Interview Accommodations</h3>
            <CloseButton onClick={() => setShowAccommodationsPanel(false)}>×</CloseButton>
          </AccommodationsPanelHeader>

          <AccommodationsContent>
            <AccommodationOption>
              <AccommodationLabel>Request Time Extension (15 min)</AccommodationLabel>
              <AccommodationButton
                onClick={handleRequestExtension}
                disabled={accommodationsUsed.extendedTime}
              >
                {accommodationsUsed.extendedTime ? 'Requested' : 'Request'}
              </AccommodationButton>
            </AccommodationOption>

            <AccommodationOption>
              <AccommodationLabel>Breaks Taken: {accommodationsUsed.breaksTaken}</AccommodationLabel>
              <AccommodationButton
                onClick={handlePauseAssessment}
                disabled={isPaused}
              >
                Take Break
              </AccommodationButton>
            </AccommodationOption>

            <AccommodationOption>
              <AccommodationLabel>Font Size</AccommodationLabel>
              <FontSizeControls>
                <FontSizeButton onClick={() => setAccommodationsUsed(prev => ({
                  ...prev,
                  customEnvironment: { ...prev.customEnvironment, fontSize: 14 }
                }))}>
                  A
                </FontSizeButton>
                <FontSizeButton onClick={() => setAccommodationsUsed(prev => ({
                  ...prev,
                  customEnvironment: { ...prev.customEnvironment, fontSize: 16 }
                }))}>
                  A+
                </FontSizeButton>
                <FontSizeButton onClick={() => setAccommodationsUsed(prev => ({
                  ...prev,
                  customEnvironment: { ...prev.customEnvironment, fontSize: 18 }
                }))}>
                  A++
                </FontSizeButton>
              </FontSizeControls>
            </AccommodationOption>

            <AccommodationOption>
              <AccommodationLabel>Theme</AccommodationLabel>
              <ThemeSelect
                value={accommodationsUsed.customEnvironment.theme || 'light'}
                onChange={(e) => setAccommodationsUsed(prev => ({
                  ...prev,
                  customEnvironment: { ...prev.customEnvironment, theme: e.target.value }
                }))}
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
                <option value="highContrast">High Contrast</option>
              </ThemeSelect>
            </AccommodationOption>
          </AccommodationsContent>
        </AccommodationsPanel>
      )}

      <AssessmentContent>
        <ProblemPanel>
          <ProblemDescription>
            <ReactMarkdown>{currentProblem.description}</ReactMarkdown>
          </ProblemDescription>

          {currentProblem.test_cases && currentProblem.test_cases.length > 0 && (
            <ProblemTestCases>
              <h3>Example Test Cases</h3>
              <TestCasesList>
                {currentProblem.test_cases.map((testCase, index) => (
                  <TestCaseItem key={index}>
                    <TestCaseHeader>
                      <span>Test {index + 1}</span>
                    </TestCaseHeader>
                    <TestCaseContent>
                      <div>
                        <strong>Input:</strong> {testCase.input}
                      </div>
                      <div>
                        <strong>Expected Output:</strong> {testCase.expected_output}
                      </div>
                    </TestCaseContent>
                  </TestCaseItem>
                ))}
              </TestCasesList>
            </ProblemTestCases>
          )}
        </ProblemPanel>

        <CodePanel>
          <CodeHeader>
            <LanguageSelect
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
            </LanguageSelect>

            <CodeActions>
              <ActionButton
                onClick={handleRunCode}
                disabled={isRunning}
                color="#3b82f6"
              >
                <FiPlayCircle size={18} />
                <span>{isRunning ? 'Running...' : 'Run Code'}</span>
              </ActionButton>

              <ActionButton
                onClick={handleSubmitSolution}
                disabled={isRunning}
                color="#10b981"
              >
                <FiSend size={18} />
                <span>Submit</span>
              </ActionButton>
            </CodeActions>
          </CodeHeader>

          <EditorContainer>
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={handleCodeChange}
              theme={accommodationsUsed.customEnvironment.theme === 'dark' ? 'vs-dark' : 'vs-light'}
              options={{
                fontSize: accommodationsUsed.customEnvironment.fontSize || 14,
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </EditorContainer>

          {testResults && (
            <TestResultsPanel>
              <TestResultsHeader>
                <h3>Test Results</h3>
              </TestResultsHeader>

              {testResults.error ? (
                <TestResultsError>
                  <FiAlertCircle size={20} />
                  <span>{testResults.error}</span>
                </TestResultsError>
              ) : (
                <TestResultsContent>
                  <TestResultsSummary success={testResults.passed_test_cases === testResults.total_test_cases}>
                    <FiCheckCircle size={20} />
                    <span>{testResults.passed_test_cases} of {testResults.total_test_cases} tests passed</span>
                  </TestResultsSummary>

                  {testResults.visible_tests && testResults.visible_tests.map((test, index) => (
                    <TestResultItem key={index} success={test.passed}>
                      <TestResultIcon success={test.passed}>
                        {test.passed ? <FiCheckCircle size={16} /> : <FiAlertCircle size={16} />}
                      </TestResultIcon>
                      <TestResultDetails>
                        <TestResultName>{test.test_name}</TestResultName>
                        {!test.passed && test.output && (
                          <TestResultOutput>
                            <div><strong>Expected:</strong> {test.expected}</div>
                            <div><strong>Actual:</strong> {test.output}</div>
                          </TestResultOutput>
                        )}
                      </TestResultDetails>
                    </TestResultItem>
                  ))}

                  {testResults.hidden_tests && (
                    <HiddenTestsInfo>
                      <p>
                        {testResults.hidden_tests.filter(t => t.passed).length} of {testResults.hidden_tests.length} hidden tests passed.
                      </p>
                    </HiddenTestsInfo>
                  )}
                </TestResultsContent>
              )}
            </TestResultsPanel>
          )}
        </CodePanel>
      </AssessmentContent>
    </AssessmentContainer>
  );
};

// Styled Components
const AssessmentContainer = styled.div`
  min-height: calc(100vh - 70px);
  background-color: ${({ theme }) => theme.colors.background};
  
  /* Specific styles based on neurodivergent profile */
  ${({ neurodivergentProfile, theme }) => {
    if (neurodivergentProfile === 'adhd') {
      return `
        /* ADHD optimizations: reduced visual clutter, focused interface */
        background-color: #f8fafc;
      `;
    }
    if (neurodivergentProfile === 'asd') {
      return `
        /* Autism optimizations: consistent structure, literal UI */
        background-color: #f8fafc;
      `;
    }
    return '';
  }}
`;

const AssessmentHeader = styled.header`
  background-color: white;
  padding: 1rem 2rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const AssessmentTitle = styled.h1`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.heading};
  margin: 0;
`;

const AssessmentControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-wrap: wrap;
    justify-content: flex-start;
  }
`;

const TimeDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ${({ isLow }) => isLow ? '#fee2e2' : '#f3f4f6'};
  color: ${({ isLow }) => isLow ? '#ef4444' : '#374151'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 500;
  animation: ${({ isPaused, isLow }) => 
    isPaused ? 'pulse 2s infinite' : (isLow ? 'blink 1s infinite' : 'none')};
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
  }
  
  @keyframes blink {
    0% { background-color: #fee2e2; }
    50% { background-color: #fecaca; }
    100% { background-color: #fee2e2; }
  }
`;

const ControlButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  color: ${({ color }) => color || '#374151'};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #e5e7eb;
  }
`;

const AssessmentContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: calc(100vh - 130px);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    height: auto;
  }
`;

const ProblemPanel = styled.div`
  background-color: white;
  overflow-y: auto;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    max-height: 300px;
  }
`;

const ProblemDescription = styled.div`
  padding: 2rem;
  
  h1, h2, h3 {
    color: ${({ theme }) => theme.colors.heading};
  }
  
  p, li {
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.6;
  }
  
  code {
    background-color: ${({ theme }) => theme.colors.surface};
    padding: 0.2rem 0.4rem;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    font-size: 0.9em;
  }
  
  pre {
    background-color: ${({ theme }) => theme.colors.surface};
    padding: 1rem;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    overflow-x: auto;
  }
`;

const ProblemTestCases = styled.div`
  padding: 0 2rem 2rem;
  
  h3 {
    color: ${({ theme }) => theme.colors.heading};
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
`;

const TestCasesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TestCaseItem = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
`;

const TestCaseHeader = styled.div`
  background-color: #e5e7eb;
  padding: 0.5rem 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const TestCaseContent = styled.div`
  padding: 1rem;
  
  div {
    margin-bottom: 0.5rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  strong {
    font-weight: 500;
  }
`;

const CodePanel = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 1px solid ${({ theme }) => theme.colors.border};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    border-left: none;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const CodeHeader = styled.div`
  padding: 1rem;
  background-color: white;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LanguageSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: white;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CodeActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ${({ color }) => color || '#6b7280'};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    background-color: #d1d5db;
    cursor: not-allowed;
  }
`;

const EditorContainer = styled.div`
  flex: 1;
`;

const TestResultsPanel = styled.div`
  background-color: white;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  max-height: 200px;
  overflow-y: auto;
`;

const TestResultsHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  h3 {
    margin: 0;
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.heading};
  }
`;

const TestResultsContent = styled.div`
  padding: 1rem;
`;

const TestResultsSummary = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ${({ success }) => success ? '#ecfdf5' : '#fef2f2'};
  color: ${({ success }) => success ? '#10b981' : '#ef4444'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: 1rem;
  font-weight: 500;
`;

const TestResultsError = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 1rem;
  background-color: #fef2f2;
  color: #ef4444;
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const TestResultItem = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: ${({ success }) => success ? '#ecfdf5' : '#fef2f2'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const TestResultIcon = styled.div`
  color: ${({ success }) => success ? '#10b981' : '#ef4444'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const TestResultDetails = styled.div`
  flex: 1;
`;

const TestResultName = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const TestResultOutput = styled.div`
  font-size: 0.875rem;
  
  div {
    margin-bottom: 0.25rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const HiddenTestsInfo = styled.div`
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: 1rem;
  
  p {
    margin: 0;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

const AccommodationsPanel = styled.div`
  position: fixed;
  top: 70px;
  right: 0;
  width: 300px;
  background-color: white;
  box-shadow: ${({ theme }) => theme.shadows.md};
  z-index: 20;
  border-left: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom-left-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const AccommodationsPanelHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    margin: 0;
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.heading};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const AccommodationsContent = styled.div`
  padding: 1rem;
`;

const AccommodationOption = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const AccommodationLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
`;

const AccommodationButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  background-color: ${({ theme, disabled }) => disabled ? theme.colors.border : theme.colors.primary};
  color: ${({ disabled }) => disabled ? '#6b7280' : 'white'};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const FontSizeControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const FontSizeButton = styled.button`
  flex: 1;
  padding: 0.5rem;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
  }
`;

const ThemeSelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: white;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 70px);
`;

const LoadingMessage = styled.div`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
`;

const ErrorMessage = styled.div`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.danger};
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

export default Assessment;