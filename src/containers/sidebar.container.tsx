import styled from '@emotion/styled';
import { FaBox } from "react-icons/fa";

const workspaces = [
  { id: 'default', name: 'Default Workspace' },
];

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  height: 100%;
`;

const WorkspacesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 16px 0 16px;
  font-size: 14px;

  p {
    font-weight: 700
  }
`;

const WorkspaceList = styled.ul`
  list-style: none;
  padding: 0;
  overflow: hidden;
  margin-bottom: 32px;
`;

const WorkspaceItem = styled.li`
  padding: 8px 16px;
  margin: 0px 16px;
  border-radius: 4px;
  transition: background-color 0.1s, color 0.2s;
  display: flex;
  align-items: center;
  background-color: #34495e;
  color: #ecf0f1;
  font-size: 14px;

  span {
    margin-left: 12px;
  }
`;

// const EditButton = styled.button`
//   background: none;
//   border: none;
//   color: white;
//   cursor: pointer;
//   opacity: 0; // Edit button is invisible initially
//   transition: opacity 0.2s ease;
//   &:hover {
//     opacity: 1; // Edit button becomes visible on hover
//   }
// `;

// const AddButton = styled.button`
//   background: none;
//   border: none;
//   color: white;
//   cursor: pointer;
// `;

const TenantWrapper = styled.div`
  min-height: 56px;
  max-height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  font-weight: 900;
  font-size: 18px;
`;

export default function SidebarContainer() {
  return (
    <Sidebar>
      <TenantWrapper>
        VNX TEAM
      </TenantWrapper>
      <WorkspacesHeader>
        <p>Workspaces</p>
      </WorkspacesHeader>
      <WorkspaceList>
        {workspaces.map((workspace) => (
          <WorkspaceItem key={workspace.id}>
            <FaBox />
            <span>{workspace.name}</span>
            {/* <EditButton>
              <IoIosCreate size={20} />
            </EditButton> */}
          </WorkspaceItem>
        ))}
      </WorkspaceList>
    </Sidebar>
  );
}
