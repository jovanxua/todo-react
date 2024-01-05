import React from 'react';
import styled from '@emotion/styled';

interface ColumnProps {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Column: React.FC<ColumnProps> = ({ title, children, footer }) => {
  return (
    <ColumnContainer>
      <Title>{title}</Title>
      <ScrollableWrapper>
        {children}
      </ScrollableWrapper>
      {footer && (
        <Footer>
          {footer}
        </Footer>
      )}
    </ColumnContainer>
  );
};

const ColumnContainer = styled.div`
  background: #1C2B36;
  border-radius: 8px;
  padding: 8px 6px;
  color: white;
  width: 264px;
  max-width: 264px;
  max-height: 100%;
  padding: 2px 4px;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`;

const Footer = styled.div``;

const ScrollableWrapper = styled.div``;  

const Title = styled.h2`
  font-size: 14px;
  padding: 4px 8px;
`;

export default Column;
