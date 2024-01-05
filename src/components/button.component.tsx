import React from 'react';
import styled from '@emotion/styled';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string;
  iconsize?: number;
  children: React.ReactNode;
  isactive?: boolean;
}

export default function ButtonComponent(props: ButtonProps) {
  const { children, icon, isactive = false, iconsize = 16 } = props;

  return (
    <Button {...props} isactive={isactive ? 'active' : ''}>
      {icon && <Icon src={icon} iconsize={iconsize} />}
      {children}
    </Button>
  );
}

const Button = styled.button<{ isactive: string }>`
  pointer-events: all;
  cursor: pointer;
  flex-shrink: 1;
  -webkit-box-flex: 0;
  flex-grow: 0;
  height: 36px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  background-color: transparent;
  color: #ffffff;
  font-weight: 500;
  border: 1px solid #ffffff;
  font-size: ${(props) => props.isactive ? 17 : 15}px;
`;

const Icon = styled.img<{ iconsize: number }>`
  margin-left: 16px;
  margin-right: 8px;
  height: ${props => props.iconsize}px;
  width: ${props => props.iconsize}px;
`;
