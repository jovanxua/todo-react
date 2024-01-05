export interface ItemData {
  id: string;
  title: string;
}

export interface ItemGroupData extends ItemData {
  id: string;
  title: string;
  items: ItemData[];
}

export interface AuditProps {
  createdAt?: number;
  createdBy?: string;
  updatedAt?: number;
  updatedBy?: string;
  deleteAt?: number;
  deletedBy?: string;
  isDeleted?: boolean;
}

export enum TaskStatusEnum {
  DONE = 'done',
  ONGOING = 'ongoing',
  TODO = 'todo'
}

export interface Workspace extends AuditProps {
  id: string;
  name: string;
  currency: string;
}

export interface Task extends AuditProps {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  workspaceId: string;
  parentId: string | null;
  status: TaskStatusEnum;
  cost: number | null;
  orderIndex: number;
}

export interface TaskCreateProps extends Omit<Task, | 'id' | 'slug' | 'orderIndex'>{};

export interface Column {
  id: string;
  title: string;
}

export interface AggregatedTasksColumn {
  id: string;
  title: string;
  items: Task[];
}

export type AggregatedTasksColumns = Record<string, AggregatedTasksColumn>;

export type AggregatedTasksData = {
  columns: AggregatedTasksColumns,
  columnOrder: string[];
}

export type ItemGroupDataOrder = string[];

export enum TaskEventEnum {
  TASK_ADDED = 'task_added',
  TASK_UPDATED = 'task_updated',
  TASK_REMOVED = 'task_removed',
  SERVER_CONNECTED = 'connected',
  SERVER_DISCONNECTED = 'disconnected',
}
