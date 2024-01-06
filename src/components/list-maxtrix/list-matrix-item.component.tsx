import styled from '@emotion/styled';
import { DraggableProvided } from 'react-beautiful-dnd';
import { ItemData, Task } from '../../types';

interface ItemProps {
  provided: DraggableProvided;
  item: ItemData;
  style?: React.CSSProperties;
  isDragging?: boolean;
  onItemClick: (task: Task) => void;
}

interface GetStyleProps {
  draggableStyle: React.CSSProperties;
  virtualStyle: React.CSSProperties;
  isDragging: boolean;
}

function getStyle({ draggableStyle, virtualStyle, isDragging }: GetStyleProps) {
  const combined = {
    ...virtualStyle,
    ...draggableStyle
  };

  const grid = 8;
  combined.height
  const result = {
    ...combined,
    height: isDragging ? combined.height : (combined.height ? +combined.height : 0) - grid,
    left: isDragging ? combined.left : (combined.left ? +combined.left : 0) + grid,
    width: isDragging
      ? draggableStyle.width
      : `calc(${combined.width} - ${grid * 2}px)`,
    marginBottom: grid
  };
  return result;
}

function Item({ provided, item, style, isDragging = false, onItemClick }: ItemProps) {
  return (
    <StyledItem
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      style={getStyle({
        draggableStyle: provided.draggableProps.style ?? {},
        virtualStyle: style ?? {},
        isDragging
      })}
      $isDragging={isDragging}
      onClick={() => onItemClick(item as Task)}
    >
      <Title>{item.title}</Title>
    </StyledItem>
  );
}

const StyledItem = styled.div<{ $isDragging: boolean }>`
  background: rgb(34, 39, 43);
  border: none;
  box-sizing: border-box;
  border-radius: 12px;
  color: #cdd5ee;
  font-size: 14px;
  user-select: none;
  font-weight: 400;
  padding: 8px 12px 4px;
  align-items: center;
  display: flex;

  ${({ $isDragging }) => $isDragging ? `
    background: #515b7d;
    border: 1px solid #006fff;
    box-shadow: 0px 0px 2px rgb(8, 58, 30), 0px 0px 10px #006fff;
  ` : ''}

  &:hover {
    border: 1px solid #006fff;
    box-shadow: 0px 0px 2px rgb(8, 58, 30), 0px 0px 10px #006fff;
  }
`;

const Title = styled.span`
  margin-top: -4px;
  white-space: pre-wrap; /* This will preserve whitespace and wrap text */
  word-wrap: break-word;
  overflow: hidden;
`;

export default Item;
