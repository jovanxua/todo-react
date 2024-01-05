import React from 'react';
import styled from '@emotion/styled';

interface SidebarProps {
  children: React.ReactNode;
  isOpen: boolean;
}
const Sidebar: React.FC<SidebarProps> = ({ children, isOpen }) => {
  return <SidebarContainer isOpen={isOpen}>{children}</SidebarContainer>;
}

const SidebarContainer = styled.nav<{ isOpen: boolean }>`
  grid-area: sidebar;
  z-index: 1;
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  background-color: hsla(206,13.7%,10%,0.9);
  transition: transform 0.3s ease-in-out;
  transform: ${({ isOpen }) => isOpen ? 'translateX(0)' : 'translateX(-240px)'};
  border-right: 1px solid rgba(255, 255, 255, 0.15);
`;

export default Sidebar;
