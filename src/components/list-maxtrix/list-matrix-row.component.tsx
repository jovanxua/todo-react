import React from 'react';
import { areEqual } from "react-window";
import { Draggable } from "react-beautiful-dnd";
import Item from './list-matrix-item.component';
import { ItemData, Task } from '../../types';

interface ListMatrixRow {
  data: {
    items: ItemData[],
    onItemClick: (task: Task) => void;
  },
  index: number;
  style: React.CSSProperties;
}

const ListMatrixRow = React.memo(function Row(props: ListMatrixRow) {
  const { data: { items, onItemClick }, index, style } = props;
  const item = items[index];

  if (!item) {
    return null;
  }

  return (
    <Draggable draggableId={item.id} index={index} key={item.id}>
      {provided => <Item provided={provided} item={item} style={style} onItemClick={onItemClick} />}
    </Draggable>
  );
}, areEqual);


export default ListMatrixRow;
