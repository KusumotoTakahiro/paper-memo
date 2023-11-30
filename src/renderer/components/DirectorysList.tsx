import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import { green, pink, blue } from '@mui/material/colors';

interface Props {
  dirs: string[];
  deleteAction: (index: number) => void;
  setSelectedIdx: (index: number) => void;
}

export default function DirectorysList({
  dirs,
  deleteAction,
  setSelectedIdx,
}: Props) {
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleDeleteClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    deleteAction(index);
  };

  const handleDefaultSelect = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    setSelectedIndex(index);
    setSelectedIdx(index);
  };

  React.useEffect(() => {
    window.electron.electronStore.getSelectedIndex().then((index: number) => {
      setSelectedIndex(index);
    });
  }, []);

  const generate = () => {
    return dirs.map((value, index) => (
      <ListItem
        key={index}
        secondaryAction={
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={(event) => handleDeleteClick(event, index)}
          >
            <DeleteIcon />
          </IconButton>
        }
        style={{
          width: 600,
        }}
      >
        <ListItemAvatar>
          <IconButton onClick={(event) => handleDefaultSelect(event, index)}>
            {index === selectedIndex ? (
              <Avatar sx={{ bgcolor: blue[500] }}>
                <FolderIcon style={{ color: 'white' }} />
              </Avatar>
            ) : (
              <Avatar>
                <FolderIcon />
              </Avatar>
            )}
          </IconButton>
        </ListItemAvatar>
        <ListItemText
          primary={value}
          secondary={secondary ? 'Secondary text' : null}
        />
      </ListItem>
    ));
  };

  return <List dense={dense}>{generate()}</List>;
}
