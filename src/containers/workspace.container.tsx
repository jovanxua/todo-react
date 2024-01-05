import { useCallback, useState } from 'react';
import styled from '@emotion/styled';
import { FiPlus } from 'react-icons/fi';
import ListCard from '../components/list-maxtrix/list-matrix.component';
import { useAggregatedTasksData } from '../hooks/use-tasks.hook';
import Button from '../components/button/button.component';
import Modal from '../components/modal/modal.component';
import TaskDetails from './task-details.container';
import { Task, TaskStatusEnum } from '../types';
import { usePatchTask } from '../hooks/use-tasks.hook';
import LoadingSpinner from '../components/loading/loading.component';

const Workspace: React.FC<{}> = () => {
  const [showTaskDetails, setShowTaskDetails] = useState(false); 
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const { isLoading, isError, error, data, tasks } = useAggregatedTasksData('default');
  const { mutate: patchTask } = usePatchTask();

  const handleItemClick = useCallback((task: Task) => {
    setSelectedTask(task.id);
    setShowTaskDetails(true);
  }, []);

  const handleItemStatusUpdate = useCallback((item: Task, status: TaskStatusEnum) => {
    patchTask({
      id: item.id,
      status,
      workspaceId: item.workspaceId,
    })
  }, []);

  const handleCreateTask = useCallback((task: Task) => {
    setSelectedTask(task.id)
  }, []);

  const handleClickNewTask = useCallback(() => {
    setSelectedTask(null);
    setShowTaskDetails(val => !val);
  }, []);

  const activeTask = tasks?.find((task) => task.id === selectedTask) || null;

  if (isError) return 'An error has occurred: ' + error;

  return (
    <WorkspaceContainer>
      <WorkspaceDetails>
        <p>Default Workspace</p>
        <StyledButton onClick={handleClickNewTask}>
          <StyledPlusIcon />
          New task
        </StyledButton>
      </WorkspaceDetails>
      {!isLoading && (
        <ListWrapper>
          <ListCard data={data} onItemClick={handleItemClick} onItemStatusUpdate={handleItemStatusUpdate} />
        </ListWrapper>
      )}
      {isLoading && <LoadingSpinner />}
      <Modal isOpen={showTaskDetails} onClose={() => setShowTaskDetails(val => !val)}>
        <TaskDetails initialValues={activeTask} onCreateTask={handleCreateTask} />
      </Modal>
    </WorkspaceContainer>
  )
};

const WorkspaceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  height: 100%;
`;

const ListWrapper = styled.div`
  padding: 32px;
`;

const WorkspaceDetails = styled.div`
  background-color: rgba(0, 0, 0, 0.24);
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);

  p {
    width: auto;
    padding: 0px 24px;
    font-weight: 700;
    font-size: 18px;
    color: #ffffff;
    text-shadow: 0px 0px 2px #006fff,
      0px 0px 15px rgba(0, 111, 255, 0.5);
  }
`;

const StyledButton = styled(Button)`
  margin-right: 24px;
  display: block;
  background-color: #16a085;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #1abc9c;
  }
`;

const StyledPlusIcon = styled(FiPlus)`
  margin-right: 8px;
`;

export default Workspace;
