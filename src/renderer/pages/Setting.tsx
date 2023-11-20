import * as React from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

const Setting = () => {
  const [workDirPath, setWorkDirPath] = React.useState<string>('');
  const [changed, setChanged] = React.useState<boolean>(false);

  const getWorkDirPath = async () => {
    await window.electron.fileDialog.open().then((filePath) => {
      setWorkDirPath(filePath);
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWorkDirPath(event.target.value);
    setChanged(true);
  };

  return (
    <>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid
          item
          xs={12}
          sm={12}
          style={{
            marginTop: 70,
          }}
        >
          <Button variant="outlined" onClick={getWorkDirPath}>
            作業ディレクトリの追加
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          style={{
            marginTop: 70,
          }}
        >
          <TextField
            label="作業ディレクトリ"
            variant="standard"
            value={workDirPath}
            style={{
              width: 600,
            }}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Setting;
