// src/pages/Assessment.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { assessmentService } from '../services/assessmentService';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';

// Icons
import {
  FiClock, FiCheckCircle, FiSend, FiPlayCircle,
  FiPauseCircle, FiSettings, FiAlertCircle, FiCode
} from 'react-icons/fi';

// Language configuration
const LANGUAGE_CONFIGS = {
  javascript: {
    name: 'JavaScript',
    monaco: 'javascript',
    defaultCode: 'function solution() {\n  // Your code here\n  return null;\n}\n',
    extension: '.js'
  },
  python: {
    name: 'Python',
    monaco: 'python',
    defaultCode: 'def solution():\n    # Your code here\n    return None\n',
    extension: '.py'
  },
  java: {
    name: 'Java',
    monaco: 'java',
    defaultCode: `public class Solution {
    public static void main(String[] args) {
        // Your code here
    }
}\n`,
    extension: '.java'
  },
  cpp: {
    name: 'C++',
    monaco: 'cpp',
    defaultCode: `#include <iostream>

int solution() {
    // Your code here
    return 0;
}\n`,
    extension: '.cpp'
  },
  csharp: {
    name: 'C#',
    monaco: 'csharp',
    defaultCode: `using System;

public class Solution {
    public static void Main(string[] args) {
        // Your code here
    }
}\n`,
    extension: '.cs'
  },
  rust: {
    name: 'Rust',
    monaco: 'rust',
    defaultCode: `fn solution() -> Option<i32> {
    // Your code here
    None
}\n`,
    extension: '.rs'
  },
  go: {
    name: 'Go',
    monaco: 'go',
    defaultCode: `package main

func solution() int {
    // Your code here
    return 0
}\n`,
    extension: '.go'
  }
};

const Assessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [assessment, setAssessment] = useState(null);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Expanded code state
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [testResults, setTestResults] = useState(null);

  // Assessment control states
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);

  // Accommodation states
  const [showAccommodationsPanel, setShowAccommodationsPanel] = useState(false);
  const [accommodationsUsed, setAccommodationsUsed] = useState({
    extendedTime: false,
    breaksTaken: 0,
    customEnvironment: {
      theme: 'vs-light',
      fontSize: 14
    }
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

          // Set default code based on the problem and language
          const defaultCode = getDefaultCode(problemData);
          setCode(defaultCode);
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

  // Default code generation helper
  const getDefaultCode = (problem) => {
    // Check if problem has language-specific starter code
    if (problem.starter_code && problem.starter_code[language]) {
      return problem.starter_code[language];
    }

    // Use predefined default code for the selected language
    return LANGUAGE_CONFIGS[language]?.defaultCode ||
           LANGUAGE_CONFIGS['javascript'].defaultCode;
  };

  // Time calculation helper
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

  // Language change handler
  const handleLanguageChange = (newLanguage) => {
    // If the language changes, update code to the default for that language
    setLanguage(newLanguage);
    const defaultCode = getDefaultCode(currentProblem);
    setCode(defaultCode);
  };

  // Code change handler
  const handleCodeChange = (value) => {
    setCode(value || '');
  };

  // Code download helper
  const downloadCode = () => {
    const langConfig = LANGUAGE_CONFIGS[language];
    const blob = new Blob([code], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `solution${langConfig.extension}`;
    link.click();
  };

  // Run code handler
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

  // Submit solution handler
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
        setTestResults(result);
      }
    } catch (err) {
      console.error('Error submitting solution:', err);
      // Show error message
    } finally {
      setIsRunning(false);
    }
  };

  // Render the assessment component
  return (
    <AssessmentContainer neurodivergentProfile={user?.is_adhd ? 'adhd' : (user?.is_asd ? 'asd' : '')}>
      {/* Header and top-level components remain the same */}
      <AssessmentContent>
        <ProblemPanel>
          {/* Problem description */}
          <ProblemDescription>
            <ReactMarkdown>{currentProblem?.description}</ReactMarkdown>
          </ProblemDescription>
        </ProblemPanel>

        <CodePanel>
          <CodeHeader>
            {/* Language Selector with expanded options */}
            <LanguageSelect
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
            >
              {Object.entries(LANGUAGE_CONFIGS).map(([langKey, langConfig]) => (
                <option key={langKey} value={langKey}>
                  {langConfig.name}
                </option>
              ))}
            </LanguageSelect>

            <CodeActions>
              <ActionButton
                onClick={downloadCode}
                color="#6b7280"
              >
                <FiCode size={18} />
                <span>Download</span>
              </ActionButton>

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
              language={LANGUAGE_CONFIGS[language].monaco}
              value={code}
              onChange={handleCodeChange}
              theme={accommodationsUsed.customEnvironment.theme}
              options={{
                fontSize: accommodationsUsed.customEnvironment.fontSize,
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: 'on',
                renderWhitespace: 'all',
                guides: {
                  indentation: true
                }
              }}
            />
          </EditorContainer>

          {/* Test Results and other components */}
          {testResults && (
            <TestResultsPanel>
              {/* Existing test results rendering logic */}
            </TestResultsPanel>
          )}
        </CodePanel>
      </AssessmentContent>

      {/* Other components like Accommodations Panel */}
    </AssessmentContainer>
  );
};

export default Assessment;