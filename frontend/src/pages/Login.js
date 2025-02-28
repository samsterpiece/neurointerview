// src/pages/Login.js
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Icons
import { FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  // Form validation schema
  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      await login(values);
      navigate(from, { replace: true });
    } catch (error) {
      setStatus({
        error: error.message || 'Login failed. Please check your credentials.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <LoginContainer>
        <LoginHeader>
          <h1>Welcome Back</h1>
          <p>Sign in to your Neurointerview account</p>
        </LoginHeader>

        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status }) => (
            <StyledForm>
              {status && status.error && (
                <ErrorAlert>
                  <FiAlertCircle size={20} />
                  <span>{status.error}</span>
                </ErrorAlert>
              )}

              <FormGroup>
                <Label htmlFor="username">Username</Label>
                <Field
                  as={Input}
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                />
                <StyledErrorMessage name="username" component="div" />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <PasswordWrapper>
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                  />
                  <PasswordToggle
                    type="button"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </PasswordToggle>
                </PasswordWrapper>
                <StyledErrorMessage name="password" component="div" />
              </FormGroup>

              <ForgotPassword to="/forgot-password">
                Forgot your password?
              </ForgotPassword>

              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </SubmitButton>

              <SignupPrompt>
                Don't have an account?{' '}
                <Link to="/register">Sign up</Link>
              </SignupPrompt>
            </StyledForm>
          )}
        </Formik>
      </LoginContainer>
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 140px);
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.surface};
`;

const LoginContainer = styled.div`
  background-color: #fff;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: ${({ theme }) => theme.colors.textLight};
    margin-bottom: 0;
  }
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  transition: border-color 0.2s ease;
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  padding: 0;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const StyledErrorMessage = styled(ErrorMessage)`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const ErrorAlert = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #fef2f2;
  border: 1px solid #fee2e2;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.875rem;
`;

const ForgotPassword = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.875rem;
  text-align: right;
  text-decoration: none;
  margin-top: -0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SubmitButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.secondaryLight};
    cursor: not-allowed;
  }
`;

const SignupPrompt = styled.p`
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default Login;

// src/pages/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Icons
import { FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Form validation schema
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must be less than 30 characters')
      .required('Username is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
    first_name: Yup.string()
      .required('First name is required'),
    last_name: Yup.string()
      .required('Last name is required'),
    user_type: Yup.string()
      .oneOf(['candidate', 'company'], 'Please select a valid user type')
      .required('Please select a user type'),
  });

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      // Remove confirmPassword as it's not needed in the API
      const { confirmPassword, ...registrationData } = values;

      await register(registrationData);
      navigate('/dashboard');
    } catch (error) {
      setStatus({
        error: error.message || 'Registration failed. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <RegisterContainer>
        <RegisterHeader>
          <h1>Create an Account</h1>
          <p>Join Neurointerview today</p>
        </RegisterHeader>

        <Formik
          initialValues={{
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            first_name: '',
            last_name: '',
            user_type: 'candidate',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status }) => (
            <StyledForm>
              {status && status.error && (
                <ErrorAlert>
                  <FiAlertCircle size={20} />
                  <span>{status.error}</span>
                </ErrorAlert>
              )}

              <FieldsRow>
                <FormGroup>
                  <Label htmlFor="first_name">First Name</Label>
                  <Field
                    as={Input}
                    id="first_name"
                    name="first_name"
                    type="text"
                    placeholder="Enter your first name"
                  />
                  <StyledErrorMessage name="first_name" component="div" />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Field
                    as={Input}
                    id="last_name"
                    name="last_name"
                    type="text"
                    placeholder="Enter your last name"
                  />
                  <StyledErrorMessage name="last_name" component="div" />
                </FormGroup>
              </FieldsRow>

              <FormGroup>
                <Label htmlFor="username">Username</Label>
                <Field
                  as={Input}
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Choose a username"
                />
                <StyledErrorMessage name="username" component="div" />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Field
                  as={Input}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                />
                <StyledErrorMessage name="email" component="div" />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <PasswordWrapper>
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                  />
                  <PasswordToggle
                    type="button"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </PasswordToggle>
                </PasswordWrapper>
                <StyledErrorMessage name="password" component="div" />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Field
                  as={Input}
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                />
                <StyledErrorMessage name="confirmPassword" component="div" />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="user_type">Account Type</Label>
                <Field as={Select} id="user_type" name="user_type">
                  <option value="candidate">I'm looking for jobs (Candidate)</option>
                  <option value="company">I'm hiring engineers (Company)</option>
                </Field>
                <StyledErrorMessage name="user_type" component="div" />
              </FormGroup>

              <TermsText>
                By signing up, you agree to our{' '}
                <Link to="/terms">Terms of Service</Link> and{' '}
                <Link to="/privacy">Privacy Policy</Link>.
              </TermsText>

              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </SubmitButton>

              <LoginPrompt>
                Already have an account?{' '}
                <Link to="/login">Sign in</Link>
              </LoginPrompt>
            </StyledForm>
          )}
        </Formik>
      </RegisterContainer>
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 140px);
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.surface};
`;

const RegisterContainer = styled.div`
  background-color: #fff;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: 2.5rem;
  width: 100%;
  max-width: 550px;
`;

const RegisterHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: ${({ theme }) => theme.colors.textLight};
    margin-bottom: 0;
  }
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FieldsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  transition: border-color 0.2s ease;
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  padding: 0;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const StyledErrorMessage = styled(ErrorMessage)`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const ErrorAlert = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #fef2f2;
  border: 1px solid #fee2e2;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.875rem;
`;

const TermsText = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin: 0;
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const SubmitButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.secondaryLight};
    cursor: not-allowed;
  }
`;

const LoginPrompt = styled.p`
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default Register;