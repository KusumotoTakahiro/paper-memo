import * as React from 'react';
import {
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface Props {
  filePath: string;
  dirPath: string;
  setDirFlag: () => void;
  showFlashAlert: (
    severity: string,
    message: string,
    alertTitle: string,
  ) => void;
}

const ContextMenu = ({
  filePath,
  dirPath,
  setDirFlag,
  showFlashAlert,
}: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleClose = () => {
    console.log(filePath);
    setAnchorEl(null);
  };

  const openByCommand = (filePath: string) => {
    window.electron.cliFunctions.openByBrowser(filePath);
  };

  const delFile = async () => {
    await window.electron.cliFunctions.delFile(filePath);
  };

  return (
    <>
      <IconButton
        aria-label="more"
        id="vert-button"
        edge="end"
        aria-controls={open ? 'my-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="my-menu"
        MenuListProps={{
          'aria-labelledby': 'vert-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 30 * 4.5,
            width: '20ch',
          },
        }}
      >
        <MenuItem
          key="open file"
          onClick={() => {
            openByCommand(filePath);
            handleClose();
          }}
        >
          Open file
        </MenuItem>
        <MenuItem
          key="delete file"
          onClick={() => {
            setDialogOpen(true);
            handleClose();
          }}
        >
          Delete file
        </MenuItem>
        <MenuItem
          key="open explorer"
          onClick={() => {
            openByCommand(dirPath);
            handleClose();
          }}
        >
          Open explorer
        </MenuItem>
      </Menu>
      <Dialog open={dialogOpen} keepMounted>
        <DialogTitle>削除確認⚠️</DialogTitle>
        <DialogContent>選択したファイルを本当に削除しますか．</DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              setDialogOpen(false);
            }}
          >
            戻る
          </Button>
          <Button
            onClick={async () => {
              await delFile();
              await setDialogOpen(false);
              await setDirFlag();
              showFlashAlert(
                'error',
                'ファイルを削除しました',
                '【Delete File】',
              );
            }}
          >
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ContextMenu;
