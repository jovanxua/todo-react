import styled from "@emotion/styled";

interface BodyProps {
  children: React.ReactNode;
}
const Body: React.FC<BodyProps> = ({ children }) => {
  return <BodyContainer>{children}</BodyContainer>;
}

const BodyContainer = styled.div`
  grid-area: body;
  background: #263B4A;
`;

export default Body;
