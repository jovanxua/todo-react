import { useQuery, UseQueryResult, UseQueryOptions, useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import fetchData from '../utils/fetch-data.util';
import { Task, ItemData, AggregatedTasksColumns, AggregatedTasksData, TaskCreateProps } from '../types';

export const getTasksQueryKey = (workspaceId: string) => {
  return ['workspaces', workspaceId, 'tasks'];
}

// Define the return type of the function
export const useFetchTaskList = (workspaceId: string): UseQueryResult<Task[], Error> => {
  const queryOptions: UseQueryOptions<Task[], Error> = {
    queryKey: getTasksQueryKey(workspaceId),
    queryFn: async () => {
      const { data } = await fetchData.get<Task[]>(`/api/tasks?workspaceId=${workspaceId}`);
      return data;
    }
  };

  return useQuery(queryOptions);
}

export const useFetchTaskColumns = (workspaceId: string): UseQueryResult<ItemData[], Error> => {
  const queryOptions: UseQueryOptions<ItemData[], Error> = {
    queryKey: ['tasks', 'column-order'],
    queryFn: async () => {
      const { data } = await fetchData.get<ItemData[]>(`/api/columns?workspaceId=${workspaceId}`,);
      return data;
    }
  };

  return useQuery(queryOptions);
}
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  // Define the mutation function
  const addTaskMutation = async (task: TaskCreateProps): Promise<Task> => {
    const { data } = await fetchData.post<Task>(`/api/tasks`, task);
    return data;
  };

  // UseMutationOptions with the correct types
  const options: UseMutationOptions<Task, Error, TaskCreateProps> = {
    mutationFn: addTaskMutation,
    onSuccess: (data) => {
      toast('New task created');
      // Update tasks data in the cache for the specific workspace
      queryClient.setQueryData<Task[]>(getTasksQueryKey(data.workspaceId), (previousTasks) => {
        const doesExist = previousTasks?.find((t) => t.id === data.id);

        if (!!doesExist) {
          return previousTasks;
        }

        return previousTasks ? [...previousTasks, data] : [data];
      });
    },
    // ... other options like onError
  };

  return useMutation<Task, Error, TaskCreateProps>(options);
};

export const usePatchTask = () => {
  const queryClient = useQueryClient();

  // Define the mutation function for partial updates
  const patchTaskMutation = async (partialTask: Partial<Task>): Promise<Task> => {
    const { data } = await fetchData.patch<Task>(`/api/tasks/${partialTask.id}`, partialTask);
    return data;
  };

  // Define the options for useMutation
  const options: UseMutationOptions<Task, Error, Partial<Task>> = {
    mutationFn: patchTaskMutation,
    onMutate: async (updatedTask) => {
      const queryKey = getTasksQueryKey(updatedTask.workspaceId || '');
      await queryClient.cancelQueries({ queryKey })
      const previousTasks = queryClient.getQueryData(queryKey)
      queryClient.setQueryData<Partial<Task>[]>(queryKey, (oldTasks) => {
        return oldTasks
          ? oldTasks.map((t) => t.id === updatedTask.id ? { ...t, ...updatedTask }
          : t) : [];
      });

      // Return a context object with the snapshotted value
      return { previousTasks, updatedTask }
    },
    onSuccess: (data) => {
      // Update the specific task in the cache without invalidating the whole list
      queryClient.setQueryData<Task[]>(['workspaces', data.workspaceId, 'tasks'], (oldTasks) => {
        return oldTasks
          ? oldTasks.map((t) => t.id === data.id ? { ...t, ...data } : t)
          : [data];
      });
    },
  };

  return useMutation<Task, Error, Partial<Task>>(options);
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  // Define the mutation function for partial updates
  const patchTaskMutation = async (partialTask: Partial<Task>): Promise<Task> => {
    const { data } = await fetchData.delete<Task>(`/api/tasks/${partialTask.id}`);
    return data;
  };

  // Define the options for useMutation
  const options: UseMutationOptions<Task, Error, Partial<Task>> = {
    mutationFn: patchTaskMutation,
    onMutate: async (deletedTask) => {
      const queryKey = getTasksQueryKey(deletedTask.workspaceId || '');
      await queryClient.cancelQueries({ queryKey })
      const previousTasks = queryClient.getQueryData(queryKey)
      queryClient.setQueryData<Partial<Task>[]>(queryKey, (oldTasks) => {
        return oldTasks ? oldTasks.filter((t) => t.id !== deletedTask.id) : [];
      });
      toast('Task deleted');
      // Return a context object with the snapshotted value
      return { previousTasks }
    },
    onSuccess: (data) => {
      // Update the specific task in the cache without invalidating the whole list
      queryClient.setQueryData<Task[]>(getTasksQueryKey(data.workspaceId), (oldTasks) => {
        return oldTasks
          ? oldTasks.filter((t) => t.id !== data.id)
          : [];
      });
    },
  };

  return useMutation<Task, Error, Partial<Task>>(options);
};

const formatDataMatrix = (tasks: Task[], columnsData: ItemData[]): AggregatedTasksData => {
  return {
    columns: columnsData.reduce((aggregatedData: AggregatedTasksColumns, col) => {
      return {
        ...aggregatedData,
        [col.id]: {
          id: col.id,
          title: col.title,
          items: tasks.filter(task => task.status === col.id),
        }
      }
    }, {}),
    columnOrder: columnsData.map(col => col.id),
  }
}

export const useAggregatedTasksData = (workspaceId: string) => {
  const taskColumnsState = useFetchTaskColumns(workspaceId);
  const taskList = useFetchTaskList(workspaceId);

  const isLoading = taskColumnsState.isLoading || taskList.isLoading;
  const isError =  taskColumnsState.isError || taskList.isError;
  const isSuccessful =  taskColumnsState.isSuccess && taskList.isSuccess;

  return {
    isLoading,
    isError,
    error: taskColumnsState.error?.message + ';' + taskList.error?.message,
    data: isSuccessful
      ? formatDataMatrix(taskList.data, taskColumnsState.data)
      : { columns: {}, columnOrder: [] },
    tasks: taskList.data,
  }
}