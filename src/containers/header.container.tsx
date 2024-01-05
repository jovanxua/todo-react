import styled from "@emotion/styled";
import jxuaImg from '../assets/jovanxua.png';

export default function HeaderContainer() {
  return (
    <HeaderWrapper>
      <Logo src={jxuaImg} />
      <Account>
        <Avatar>JX</Avatar>
      </Account>
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: flex-between;
  align-items: center;
  height: 100%;
  width: 100%;
  flex: 1;
  padding: 8px 12px 8px 12px;

`;

const Logo = styled.img`
  height: 34px;
  width: 34px;
`;

const Account = styled.div`
  display: flex;
  height: 100%;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
`;

const Avatar = styled.div`
  background: #ffffff;
  color: #000000;
  height: 34px;
  width: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  border-radius: 32px;
`;