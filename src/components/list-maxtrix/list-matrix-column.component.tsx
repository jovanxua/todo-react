import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import styled from "@emotion/styled";
import { VariableSizeList } from "react-window";
import { Droppable, Draggable } from "react-beautiful-dnd";
import ListMatrixItem from './list-matrix-item.component';
import ListMatrixRow from './list-matrix-row.component';
import { ItemGroupData, ItemData, Task } from "../../types";

interface ItemListProps {
  column: ItemGroupData,
  index: number;
  onItemClick: (task: Task) => void;
}

interface ListMatrixColumnProps {
  column: ItemGroupData,
  index: number;
  onItemClick: (task: Task) => void;
}
 
// Function to determine the size of each item
const estimateHeightFromContent = (content: string) => {
  const baseHeight = 50; // Base height for minimal content
  const lineHeight = 20; // Estimated line height
  const characterPerLine = 35; // Estimated number of characters per line

  const lineCount = Math.ceil(content.length / characterPerLine);
  return baseHeight + (lineHeight * lineCount);
};

const ItemList = React.memo(function ItemList({ column, index, onItemClick }: ItemListProps) {
  const [itemHeights, setItemHeights] = useState<number[]>([]);
  const [maxListHeight, setMaxListHeight] = useState<number>(500);

  const listRef = useRef<VariableSizeList>(null);

  useEffect(() => {
    // Function to calculate the available height
    const calculateAvailableHeight = () => {
      const headerHeight = 180;
      const footerHeight = 50;
      const availableHeight = window.innerHeight - headerHeight - footerHeight;

      return availableHeight;
    };

    // Set the initial height
    setMaxListHeight(calculateAvailableHeight());

    // Update the height on window resize
    const handleResize = () => {
      setMaxListHeight(calculateAvailableHeight());
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // Update item heights when column data changes
    const heights = column.items.map(item =>
      estimateHeightFromContent(item.title)
    );
    setItemHeights(heights);

    if (listRef.current) {
      listRef.current.resetAfterIndex(0);
    }
  }, [column.items]);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (list) {
      list.scrollTo(0);
    }
  }, [index]);

  const getItemSize = (index: number) => {
    return itemHeights[index] || 50; // Default height if not calculated
  };

  return (
    <Droppable
      droppableId={column.id}
      mode="virtual"
      renderClone={(provided, snapshot, rubric) => (
        <ListMatrixItem
          onItemClick={onItemClick}
          provided={provided}
          isDragging={snapshot.isDragging}
          item={column.items[rubric.source.index]}
        />
      )}
    >
      {(provided, snapshot) => {
        const itemCount = snapshot.isUsingPlaceholder
          ? column.items.length + 1
          : column.items.length;

        return (
          <StyledVariableSizeList
            height={maxListHeight}
            itemCount={itemCount}
            itemSize={getItemSize}
            width={300}
            outerRef={provided.innerRef}
            itemData={{ items: column.items, onItemClick }}
            ref={listRef}
          >
            {ListMatrixRow}
          </StyledVariableSizeList>
        );
      }}
    </Droppable>
  );
});

const ListMatrixColumn = React.memo(function Column({ column, index, onItemClick }: ListMatrixColumnProps) {
  return (
    <Draggable draggableId={column.id} index={index} isDragDisabled>
      {provided => (
        <ColumnContainer
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <ColumnTitle {...provided.dragHandleProps}>
            {column.title}
          </ColumnTitle>
          <ItemList column={column} index={index} onItemClick={onItemClick} />
        </ColumnContainer>
      )}
    </Draggable>
  );
}); 

const ColumnTitle = styled.h3`
  font-size: 14px;
  color: #ffffff;
  text-shadow: 0px 0px 2px #006fff,
    0px 0px 15px rgba(0, 111, 255, 0.5);
  text-align: left;
  margin: 0;
  padding: 12px;
`;

const ColumnContainer = styled.div`
  margin: 0px 16px;
  border-radius: 12px;
  background-color: rgb(16, 18, 4);
  padding: 4px 2px;
`;

const StyledVariableSizeList = styled(VariableSizeList<{ items: ItemData[], onItemClick: (task: Task) => void}>)`
  padding-left: 8px;
  padding-right: 8px;
  scrollbar-color: dark;

  overflow-y: scroll;

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.1);
    background-color: rgb(34, 39, 43);
  }

  &::-webkit-scrollbar {
    width: 8px;
    background-color: rgb(34, 39, 43);
  }

  &::-webkit-scrollbar-thumb {
    background-color: #6e6e6e;
    border-radius: 3px;
  }
`;

export default ListMatrixColumn;
