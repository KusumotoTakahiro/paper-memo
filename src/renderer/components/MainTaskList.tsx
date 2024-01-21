import React from 'react';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { TransitionGroup } from 'react-transition-group';

interface Task {
  id: string;
  body: string;
  deadline: Date;
}

// 各リストアイテムに一意のIDを割り当てる
const listItems = [
  { id: '1', label: 'リスト１' },
  { id: '2', label: 'リスト２' },
  { id: '3', label: 'リスト３' },
];

const MainTaskList = () => {
  const [items, setItems] = React.useState(listItems);
  const [dragItemId, setDragItemId] = React.useState<string>();

  const handleDragStart = (itemId: string) => {
    setDragItemId(itemId);
  };

  const handleDragOver = (event: React.MouseEvent, targetItemId: string) => {
    event.preventDefault();
    if (dragItemId === targetItemId) {
      return;
    }

    const dragItemIndex = items.findIndex(
      (item: any) => item.id === dragItemId,
    );
    const targetItemIndex = items.findIndex(
      (item: any) => item.id === targetItemId,
    );

    const newItems = Array.from(items);
    const [draggedItem] = newItems.splice(dragItemIndex, 1);
    newItems.splice(targetItemIndex, 0, draggedItem);
    setItems(newItems);
  };

  const getMyTask = () => {};

  const generate = () => {
    return (
      <>
        <ul style={{ listStyle: 'none' }}>
          {items.map((item) => (
            <li
              key={item.id}
              onDragOver={(event) => handleDragOver(event, item.id)}
            >
              <span
                style={{ cursor: 'grab', marginRight: '10px' }}
                draggable
                onDragStart={() => handleDragStart(item.id)}
              >
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </>
    );
  };

  return (
    <List>
      <TransitionGroup>{generate()}</TransitionGroup>
    </List>
  );
};

export default MainTaskList;
