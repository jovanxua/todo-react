import React from 'react';
import styled from '@emotion/styled';

const LoadingSpinner: React.FC = () => {
  return (
    <SpinnerContainer>
      <Spinner>
        <Ball />
      </Spinner>
    </SpinnerContainer>
  );
};

const SpinnerContainer = styled.div`
  overflow: hidden;
  background: none;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Spinner = styled.div`
  position: relative;
  transform: translateZ(0) scale(0.54);
  backface-visibility: hidden;
  transform-origin: 0 0;

  @keyframes ballAnimation {
    0%, 100% {
      animation-timing-function: cubic-bezier(0.45,0,0.9,0.55)
    }
    0% {
      transform: translate(0,0)
    }
    50% {
      transform: translate(0,54px);
      animation-timing-function: cubic-bezier(0,0.45,0.55,0.9);
    }
    100% {
      transform: translate(0,0);
    }
  }
`;

const Ball = styled.div`
  position: absolute;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #93dbe9;
  left: 37px;
  top: 10px;
  animation: ballAnimation 0.8s linear infinite;
`;

export default LoadingSpinner;
