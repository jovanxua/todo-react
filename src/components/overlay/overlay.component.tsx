import styled from "@emotion/styled";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 1001;
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(2px);
  height: 100%;
  width: 100%;
`;

export default Overlay;
