// src/services/assessmentService.js
import api from './api';

export const assessmentService = {
  // Get all assessments for the candidate
  async getCandidateAssessments() {
    try {
      const response = await api.get('/api/candidate-assessments/');
      return response.data;
    } catch (error) {
      console.error('Error fetching candidate assessments:', error);
      throw new Error(error.response?.data?.detail || 'Failed to fetch assessments');
    }
  },

  // Get a specific candidate assessment by ID
  async getCandidateAssessmentById(id) {
    try {
      const response = await api.get(`/api/candidate-assessments/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching candidate assessment:', error);
      throw new Error(error.response?.data?.detail || 'Failed to fetch assessment');
    }
  },

  // Get a specific problem by ID
  async getProblemById(id) {
    try {
      const response = await api.get(`/api/problems/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching problem:', error);
      throw new Error(error.response?.data?.detail || 'Failed to fetch problem');
    }
  },

  // Start a candidate assessment
  async startCandidateAssessment(id) {
    try {
      const response = await api.post(`/api/candidate-assessments/${id}/start/`);
      return response.data;
    } catch (error) {
      console.error('Error starting assessment:', error);
      throw new Error(error.response?.data?.detail || 'Failed to start assessment');
    }
  },

  // Submit a candidate assessment (mark as completed)
  async submitCandidateAssessment(id) {
    try {
      const response = await api.post(`/api/candidate-assessments/${id}/submit/`);
      return response.data;
    } catch (error) {
      console.error('Error submitting assessment:', error);
      throw new Error(error.response?.data?.detail || 'Failed to submit assessment');
    }
  },

  // Request time extension for an assessment
  async requestExtension(id, data) {
    try {
      const response = await api.post(`/api/candidate-assessments/${id}/request_extension/`, data);
      return response.data;
    } catch (error) {
      console.error('Error requesting extension:', error);
      throw new Error(error.response?.data?.detail || 'Failed to request extension');
    }
  },

  // Take a break during an assessment
  async takeBreak(id, data) {
    try {
      const response = await api.post(`/api/candidate-assessments/${id}/take_break/`, data);
      return response.data;
    } catch (error) {
      console.error('Error recording break:', error);
      throw new Error(error.response?.data?.detail || 'Failed to record break');
    }
  },

  // Run code against test cases (without submitting)
  async runCode(data) {
    try {
      // Supported programming languages
      const supportedLanguages = [
        'javascript', 'python', 'java', 'cpp', 'csharp', 'rust', 'go'
      ];

      // Validate language
      if (!supportedLanguages.includes(data.language)) {
        throw new Error(`Unsupported programming language: ${data.language}`);
      }

      const response = await api.post('/api/submissions/run/', data);
      return response.data;
    } catch (error) {
      console.error('Error running code:', error);
      throw new Error(error.response?.data?.detail || 'Failed to run code');
    }
  },

  // Submit a solution for a problem
  async submitSolution(data) {
    try {
      // Supported programming languages
      const supportedLanguages = [
        'javascript', 'python', 'java', 'cpp', 'csharp', 'rust', 'go'
      ];

      // Validate language
      if (!supportedLanguages.includes(data.language)) {
        throw new Error(`Unsupported programming language: ${data.language}`);
      }

      const response = await api.post('/api/submissions/', data);
      return response.data;
    } catch (error) {
      console.error('Error submitting solution:', error);
      throw new Error(error.response?.data?.detail || 'Failed to submit solution');
    }
  },

  // Get all submissions for a candidate assessment
  async getSubmissions(candidateAssessmentId) {
    try {
      const response = await api.get('/api/submissions/', {
        params: { candidate_assessment: candidateAssessmentId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching submissions:', error);
      throw new Error(error.response?.data?.detail || 'Failed to fetch submissions');
    }
  },

  // Get test results for a submission
  async getTestResults(submissionId) {
    try {
      const response = await api.get(`/api/submissions/${submissionId}/test_results/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching test results:', error);
      throw new Error(error.response?.data?.detail || 'Failed to fetch test results');
    }
  },

  // For companies: Get all assessments created by the company
  async getCompanyAssessments() {
    try {
      const response = await api.get('/api/assessments/');
      return response.data;
    } catch (error) {
      console.error('Error fetching company assessments:', error);
      throw new Error(error.response?.data?.detail || 'Failed to fetch assessments');
    }
  },

  // For companies: Create a new assessment
  async createAssessment(data) {
    try {
      const response = await api.post('/api/assessments/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating assessment:', error);
      throw new Error(error.response?.data?.detail || 'Failed to create assessment');
    }
  },

  // For companies: Update an assessment
  async updateAssessment(id, data) {
    try {
      const response = await api.patch(`/api/assessments/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating assessment:', error);
      throw new Error(error.response?.data?.detail || 'Failed to update assessment');
    }
  },

  // For companies: Delete an assessment
  async deleteAssessment(id) {
    try {
      await api.delete(`/api/assessments/${id}/`);
      return true;
    } catch (error) {
      console.error('Error deleting assessment:', error);
      throw new Error(error.response?.data?.detail || 'Failed to delete assessment');
    }
  },

  // For companies: Assign candidates to an assessment
  async assignCandidates(assessmentId, candidateIds) {
    try {
      const response = await api.post(`/api/assessments/${assessmentId}/assign_candidates/`, {
        candidate_ids: candidateIds
      });
      return response.data;
    } catch (error) {
      console.error('Error assigning candidates:', error);
      throw new Error(error.response?.data?.detail || 'Failed to assign candidates');
    }
  },

  // For companies: Create a new problem
  async createProblem(data) {
    try {
      const response = await api.post('/api/problems/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating problem:', error);
      throw new Error(error.response?.data?.detail || 'Failed to create problem');
    }
  },

  // For companies: Get all problems
  async getAllProblems() {
    try {
      const response = await api.get('/api/problems/');
      return response.data;
    } catch (error) {
      console.error('Error fetching problems:', error);
      throw new Error(error.response?.data?.detail || 'Failed to fetch problems');
    }
  },
};