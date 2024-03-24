import { useState } from 'react';
import { Grid, Button } from '@mui/material';

interface Props {
  showFlashAlert: (
    severity: string,
    message: string,
    alertTitle: string,
  ) => void;
}

const MyDictionary = ({ showFlashAlert }: Props) => {
  const b = (type: number) => {
    const types = ['success', 'info', 'error', 'warning'];
    showFlashAlert(types[type], types[type], 'テスト');
  };
  return (
    <>
      <Grid container spacing={2}>
        <Grid item sm={6}></Grid>
        <Button onClick={() => b(0)}>Success</Button>
        <Button onClick={() => b(1)}>Info</Button>
        <Button onClick={() => b(2)}>Error</Button>
        <Button onClick={() => b(3)}>warning</Button>
      </Grid>
    </>
  );
};

export default MyDictionary;
