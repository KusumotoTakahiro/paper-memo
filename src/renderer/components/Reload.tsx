import * as React from 'react';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import { IconButton } from '@mui/material';

interface Props {
  reloadAction: () => void;
}

const Reload = ({ reloadAction }: Props) => {
  return (
    <>
      <IconButton
        onClick={reloadAction}
        sx={{
          position: 'fixed',
          bottom: 10,
          right: 20,
          color: '#abb8ff',
          backgroundColor: 'white',
        }}
        size="small"
      >
        <AutorenewRoundedIcon />
      </IconButton>
    </>
  );
};

export default Reload;
