// src/components/layout/Header.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';

// Icons
import { FiMenu, FiX, FiUser, FiLogOut, FiBarChart2, FiSettings } from 'react-icons/fi';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <HeaderWrapper>
      <Container>
        <LogoWrapper>
          <Link to="/">
            <Logo>
              <LogoIcon>N</LogoIcon>
              <LogoText>Neurointerview</LogoText>
            </Logo>
          </Link>
        </LogoWrapper>

        <HamburgerIcon onClick={toggleMenu}>
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </HamburgerIcon>

        <NavMenu isOpen={isOpen}>
          <NavList>
            <NavItem>
              <NavLink to="/about">About</NavLink>
            </NavItem>
            {!user && (
              <>
                <NavItem>
                  <NavLink to="/login">Login</NavLink>
                </NavItem>
                <NavItem>
                  <SignUpButton to="/register">Sign Up</SignUpButton>
                </NavItem>
              </>
            )}
            {user && (
              <>
                <NavItem>
                  <NavLink to={user.user_type === 'company' ? "/company-dashboard" : "/dashboard"}>
                    Dashboard
                  </NavLink>
                </NavItem>
                <ProfileDropdown>
                  <DropdownToggle>
                    <ProfileAvatar>
                      {user.profile_picture ? (
                        <img src={user.profile_picture} alt={user.username} />
                      ) : (
                        user.username.charAt(0).toUpperCase()
                      )}
                    </ProfileAvatar>
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={() => navigate('/profile')}>
                      <FiUser size={16} />
                      <span>Profile</span>
                    </DropdownItem>
                    {user.user_type === 'company' && (
                      <DropdownItem onClick={() => navigate('/company-dashboard')}>
                        <FiBarChart2 size={16} />
                        <span>Company Dashboard</span>
                      </DropdownItem>
                    )}
                    <DropdownItem onClick={() => navigate('/settings')}>
                      <FiSettings size={16} />
                      <span>Settings</span>
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem onClick={handleLogout}>
                      <FiLogOut size={16} />
                      <span>Logout</span>
                    </DropdownItem>
                  </DropdownMenu>
                </ProfileDropdown>
              </>
            )}
          </NavList>
        </NavMenu>
      </Container>
    </HeaderWrapper>
  );
};

// Styled Components
const HeaderWrapper = styled.header`
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.header};
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

const HamburgerIcon = styled.div`
  display: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }
`;

const NavMenu = styled.nav`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-100%)')};
    opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
    visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
    z-index: 10;
    padding: 1rem;
  }
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const NavItem = styled.li`
  position: relative;
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  padding: 0.5rem 0;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SignUpButton = styled(Link)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 500;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
    color: white;
  }
`;

const ProfileDropdown = styled.div`
  position: relative;
`;

const DropdownToggle = styled.div`
  cursor: pointer;
`;

const ProfileAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  min-width: 200px;
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    position: static;
    box-shadow: none;
    margin-top: 1rem;
  }
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.surface};
  }
  
  &:first-child {
    border-top-left-radius: ${({ theme }) => theme.borderRadius.md};
    border-top-right-radius: ${({ theme }) => theme.borderRadius.md};
  }
  
  &:last-child {
    border-bottom-left-radius: ${({ theme }) => theme.borderRadius.md};
    border-bottom-right-radius: ${({ theme }) => theme.borderRadius.md};
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
  margin: 0.5rem 0;
`;

export default Header;

