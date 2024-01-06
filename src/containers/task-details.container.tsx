import { useCallback, useEffect, useRef, useState } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { useForm, SubmitHandler } from 'react-hook-form';
import styled from '@emotion/styled';
import { Task, TaskStatusEnum } from '../types';
import { usePatchTask, useCreateTask, useDeleteTask } from '../hooks/use-tasks.hook';
import Overlay from '../components/overlay/overlay.component';
import Modal from '../components/modal/modal.component';

type FormData = {
  title: string;
  description: string;
  status: TaskStatusEnum;
};

interface TaskDetailsProps {
  onCreateTask: (task: Task) => void;
  onDeleteTask: () => void;
  initialValues: Task | null;
  onClose: () => void;
  show: boolean;
}

export const TaskDetails = ({ initialValues, onCreateTask, show, onClose, onDeleteTask }: TaskDetailsProps) => {
  const { mutate: patchTask } = usePatchTask();
  const { mutateAsync: createTask  } = useCreateTask();
  const { mutate: deleteTask } = useDeleteTask();
  const { register, handleSubmit, setValue, reset } = useForm<FormData>();
  const [isTitleActive, setIsTitleActive] = useState(false);
  const [isDescriptionActive, setIsDescriptionActive] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

   const handleTitleSubmit: SubmitHandler<FormData> = async (data) => {
    if (!data.title) return;

    if (initialValues) {
      patchTask({
        id: initialValues.id,
        title: data.title,
        workspaceId: 'default',
      });
    } else {
      const task = await createTask({
        title: data.title,
        status: data.status,
        workspaceId: 'default',
        cost: null,
        parentId: null,
        description: null,
      });

      onCreateTask(task);
    }
  }

  const handleDescriptionSubmit: SubmitHandler<FormData> = (data) => {
    if (initialValues) {
      patchTask({
        id: initialValues.id,
        description: data.description,
        workspaceId: 'default',
      });
    }
  }

  const handleStatusChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    if (initialValues) {
      patchTask({
        id: initialValues.id,
        status: event.currentTarget.value as TaskStatusEnum,
        workspaceId: 'default',
      });
    }
  }

  const handleDeleteTask = useCallback(() => {
    deleteTask({
      id: initialValues?.id,
      workspaceId: 'default'
    });
    onDeleteTask();
  }, [initialValues]);

  const handleTitleBlur = () => {
    if (titleInputRef.current && titleInputRef.current.value === '' || (
      initialValues?.title
        && titleInputRef.current?.value
        && initialValues?.title !== titleInputRef.current?.value
    )) {
      titleInputRef.current.focus();
    } else {
      setTimeout(() => setIsTitleActive(false), 100);
    }
  };

  const handleDescriptionBlur = () => {
    if (initialValues?.id
      && initialValues?.description !== descriptionRef.current?.value
    ) {
      descriptionRef.current!.focus();
    } else {
      setTimeout(() =>  setIsDescriptionActive(false), 100);
    }
  }

  useEffect(() => {
    reset({
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      status: initialValues?.status || TaskStatusEnum.TODO,
    })
  }, [initialValues, setValue]);

  useEffect(() => {
    if (show && !initialValues && titleInputRef.current) {
      titleInputRef.current.focus();
      setIsTitleActive(true);
    } else {
      titleInputRef.current?.blur();
      descriptionRef.current?.blur();
      setIsTitleActive(false);
    }
  }, [initialValues, show]);

  const handleCancel = (field: 'title' | 'description') => {
    if (field === 'title') {
      setValue('title', initialValues?.title || ''); // Reset the title field
      setIsTitleActive(false);
      if (titleInputRef.current) {
        titleInputRef.current.blur();
      }
    } else if (field === 'description') {
      setValue('description', initialValues?.description || ''); // Optionally reset the description field
      setIsDescriptionActive(false);
      if (descriptionRef.current) {
        descriptionRef.current.blur();
      }
    }
  };

  const { ref: titleRegisterRef, ...titleRegisterProps } = register('title');
  const { ref: descriptionRegisterRef, ...descriptionRegisterProps } = register('description');

  return (
    <>
      <Modal isOpen={show} onClose={onClose}>
        <SelectWrapper>
          <Select {...register('status')} onChange={handleStatusChange} disabled={isTitleActive}>
            <option value={TaskStatusEnum.TODO}>TODO</option>
            <option value={TaskStatusEnum.ONGOING}>ONGOING</option>
            <option value={TaskStatusEnum.DONE}>DONE</option>
          </Select>
          <Arrow />
        </SelectWrapper>
        <Form onSubmit={handleSubmit(handleTitleSubmit)} name="titleForm">
          <FormTitle isActive={isTitleActive}>Title</FormTitle>
          <Input
            {...titleRegisterProps}
            placeholder="Enter a title"
            autoComplete="off"
            onFocus={() => setIsTitleActive(true)}
            onBlur={handleTitleBlur}
            ref={(e) => {
              titleRegisterRef(e);
              (titleInputRef as any).current = e;
            }}
            isActive={isTitleActive}
          />
          {isTitleActive && (
            <ButtonGroup>
              <SaveButton style={{ zIndex: 2001 }} color="#5aac44" type="submit">Save</SaveButton>
              {!!initialValues && <CancelButton type="button" onClick={() => handleCancel('title')}>Cancel</CancelButton>}
            </ButtonGroup>
          )}
        </Form>
        <Form onSubmit={handleSubmit(handleDescriptionSubmit)} name="descriptionForm">
          <FormTitle isActive={isDescriptionActive}>Description</FormTitle>
          <Textarea
            {...descriptionRegisterProps}
            placeholder="Add a more detailed description..."
            rows={3}
            onFocus={() => setIsDescriptionActive(true)}
            onBlur={handleDescriptionBlur}
            isActive={isDescriptionActive}
            ref={(e) => {
              descriptionRegisterRef(e);
              (descriptionRef as any).current = e;
            }}
          />
          {isDescriptionActive && (
            <ButtonGroup>
              <SaveButton type="submit">Save</SaveButton>
              <CancelButton type="button" onClick={() => handleCancel('description')}>Cancel</CancelButton>
            </ButtonGroup>
          )}
        </Form>
        {!!initialValues && <DeleteButton onClick={handleDeleteTask}>Delete</DeleteButton>}
        {(isTitleActive || isDescriptionActive) &&<Overlay />}
      </Modal>
    </>
  );
};

const FormTitle = styled.h3<{ isActive: boolean }>`
  margin: 0;
  color: #7d7d7d;
  font-size: 1.2rem;
  margin-bottom: 5px; /* Adjust space between title and input */
  z-index: ${({ isActive }) => isActive ? 1002 : 1000};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  min-width: 372px;
`;

const Input = styled.input<{ isActive: boolean }>`
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  z-index: ${({ isActive }) => isActive ? 1002 : 1000};
`;

const SelectWrapper = styled.div`
  position: relative;
  background-color: #333; // Match this to your theme's dropdown color
  border: 1px solid #ccc;
  border-radius: 4px;
  width: fit-content; // Adjust the width as needed
  display: flex;
  justify-content: flex-start;
  margin-bottom: 32px;
`;


const Select = styled.select`
  padding: 10px 32px 10px 10px;
  appearance: none; // Remove default styling
  background-color: rgba(161, 189, 217, 0.08);
  border: none;
  color: white; // Match this to your theme's text color
  width: 100%; // Make the select fill its container

  &:focus {
    outline: none;
  }
`;

const Arrow = styled(IoIosArrowDown)`
  position: absolute;
  right: 10px; // Padding from the right edge
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
`;

const Textarea = styled.textarea<{ isActive: boolean }>`
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-height: 112px;
  z-index: ${({ isActive }) => isActive ? 1002 : 1000};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 5px;
  z-index: 1002;
`;

const SaveButton = styled.button`
  padding: 10px 15px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #16a085;
  z-index: 1003;
  &:hover {
    background-color: #1abc9c;
  }
`;

const CancelButton = styled.button`
  background-color: #999999;
  z-index: 1002;
`;

const DeleteButton = styled(SaveButton)`
  background-color: #999999;
  z-index: 1002;
  width: fit-content;
  align-self: flex-end;
  z-index: 1000;
  &:hover {
    background-color: #D11A2A;
  }
`;

export default TaskDetails;
