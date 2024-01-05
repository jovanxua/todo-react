import styled from "@emotion/styled";

interface BodyProps {
  children: React.ReactNode;
}
const Header: React.FC<BodyProps> = ({ children }) => {
  return <HeaderContainer>{children}</HeaderContainer>;
}

const HeaderContainer = styled.header`
  position: relative;
  font-size: 12px;
  line-height: 20px;
  grid-area: header;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.colors.headerBackground};
`;

HeaderContainer.defaultProps = {
  theme: {
    colors: {
      headerBackground: 'rgb(29, 33, 37)', // Provide a default color
    },
  },
} as any;

export default Header;