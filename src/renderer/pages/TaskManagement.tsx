import { useState } from 'react';
import { Grid } from '@mui/material';
import MainTaskList from '../components/MainTaskList';

const TaskManagement = () => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item sm={6}>
          <MainTaskList></MainTaskList>
        </Grid>
        <Grid item sm={6}></Grid>
      </Grid>
    </>
  );
};

export default TaskManagement;
