import React from 'react';
import styled from '@emotion/styled';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface LayoutProps {
  children: React.ReactNode;
  onSidebarStateChange: () => void;
  sidebarOpen: boolean;
}
const Layout: React.FC<LayoutProps> = ({ sidebarOpen, children, onSidebarStateChange }) => {
  return (
    <LayoutContainer sidebarOpen={sidebarOpen}>
      <ToggleButton sidebarOpen={sidebarOpen} onClick={onSidebarStateChange}>
        <span>{sidebarOpen ? <IoIosArrowBack color="#ffffff" /> : <IoIosArrowForward color="#ffffff" />}</span>
      </ToggleButton>
      {children}
    </LayoutContainer>
  );
}

const LayoutContainer = styled.div<{ sidebarOpen: boolean }>`
  display: grid;
  grid-template-columns: ${({ sidebarOpen }) => sidebarOpen ? '260px' : '16px'} 1fr;
  grid-template-rows: 50px 1fr;
  grid-template-areas: 
    "header header"
    "sidebar body";
  height: 100vh;
  width: 100vw;
  transition: grid-template-columns 0.3s ease-in-out;
`;

const ToggleButton = styled.button<{ sidebarOpen: boolean }>`
  position: absolute;
  top: 62px;
  left: ${({ sidebarOpen }) => (sidebarOpen ? '242px' : '0px')};
  z-index: 2;
  transition: left 0.3s ease-in-out;
  height: 32px;
  width: 32px;
  font-size: 10px;
  border-radius: 0px;
  border-radius: 32px;
  background-color: #1f2b38;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(159, 173, 188, 0.16);
`;

export default Layout;
