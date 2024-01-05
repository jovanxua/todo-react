import { useEffect, useState} from "react";
import styled from "@emotion/styled";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Column from "./list-matrix-column.component";
import { AggregatedTasksData, Task, TaskStatusEnum } from "../../types";

interface ListMatrixProps {
  data: AggregatedTasksData;
  onItemClick: (task: Task) => void;
  onItemStatusUpdate: (task: Task, status: TaskStatusEnum) => void;
}

export function reorderList<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

const ListMatrix: React.FC<ListMatrixProps> = ({ data, onItemClick, onItemStatusUpdate }: ListMatrixProps) => {
  const [state, setState] = useState<AggregatedTasksData>({
    columns: {},
    columnOrder: [],
  });

  useEffect(() => {
    setState(data);
  }, [data]);

  function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }

    if (result.type === "column") {
      // if the list is scrolled it looks like there is some strangeness going on
      // with react-window. It looks to be scrolling back to scroll: 0
      // I should log an issue with the project
      const columnOrder = reorderList(
        state.columnOrder,
        result.source.index,
        result.destination.index
      );

      setState({
        ...state,
        columnOrder
      });
      return;
    }

    // reordering in same list
    if (result.source.droppableId === result.destination.droppableId) {
      const column = state.columns[result.source.droppableId];
      const items = reorderList(
        column.items,
        result.source.index,
        result.destination.index
      );

      // updating column entry
      const newState: AggregatedTasksData = {
        ...state,
        columns: {
          ...state.columns,
          [column.id]: {
            ...column,
            items
          }
        }
      };
      setState(newState);
      return;
    }

    // moving between lists
    const sourceColumn = state.columns[result.source.droppableId];
    const destinationColumn = state.columns[result.destination.droppableId];
    const item = sourceColumn.items[result.source.index];

    // 1. remove item from source column
    const newSourceColumn = {
      ...sourceColumn,
      items: [...sourceColumn.items]
    };
    newSourceColumn.items.splice(result.source.index, 1);

    // 2. insert into destination column
    const newDestinationColumn = {
      ...destinationColumn,
      items: [...destinationColumn.items]
    };
  
    // in line modification of items
    newDestinationColumn.items.splice(result.destination.index, 0, item);

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newSourceColumn.id]: newSourceColumn,
        [newDestinationColumn.id]: newDestinationColumn
      }
    };

    setState(newState);
    onItemStatusUpdate(item, result.destination.droppableId as TaskStatusEnum);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <ListCardContainer>
        <Droppable
          droppableId="all-droppables"
          direction="horizontal"
          type="column"
        >
          {provided => (
            <ColumnsWrapper
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {state.columnOrder.map((columnId: string, index: number) => (
                <Column
                  key={columnId}
                  column={state.columns[columnId]}
                  index={index}
                  onItemClick={onItemClick}
                />
              ))}
              {provided.placeholder}
            </ColumnsWrapper>
          )}
        </Droppable>
      </ListCardContainer>
    </DragDropContext>
  );
};

const ListCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ColumnsWrapper = styled.div`
  display: flex;
`;

export default ListMatrix;
