import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import { AiOutlineClose } from 'react-icons/ai';
import Button from '../button/button.component';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <StyledBackdrop data-testid="modal-backdrop" onClick={onClose}>
      <ModalWrapper>
        <StyledModal onClick={e => e.stopPropagation()}>
          <StyledCloseButton data-testid="modal-close-btn" onClick={onClose}>
            <AiOutlineClose color="#ffffff" />
          </StyledCloseButton>
          {children}
        </StyledModal>
      </ModalWrapper>
    </StyledBackdrop>
  );
};

const StyledBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
`;

const ModalWrapper = styled.div` 
  background: #1c1c1c;
  border-radius: 12px;
`;

const StyledModal = styled.div`
  background: rgba(161, 189, 217, 0.08);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  z-index: 1001;
  position: relative;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
`;

const StyledCloseButton = styled(Button)`
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: none;
  cursor: pointer;
  padding: 34px 12px;
  font-size: 24px;
  border-color: transparent;
  z-index: 1003;

  &:hover {
    border-color: transparent;
    font-size: 25px;
  }
  &:focus,
  &:focus-visible {
    outline: none;
    border-color: transparent;
  }

  &:active {
    border-color: transparent;
    outline: none;
  }
`;

export default Modal;
