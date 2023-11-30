import * as React from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import DirectorysList from '../components/DirectorysList';
import FormForMemoTemplate from '../components/FormForMemoTemplate';

const Setting = () => {
  const [workDirPath, setWorkDirPath] = React.useState<string>('');
  const [changed, setChanged] = React.useState<boolean>(false);
  const [dirs, setDirs] = React.useState<string[]>([]);
  const [selectedIdx, setSelectedIdx] = React.useState<number>(0);

  React.useEffect(() => {
    window.electron.electronStore.getlist().then((dirs) => {
      setDirs(dirs);
    });
  }, []);

  const setNewDir = async () => {
    let newDirs: string[] = dirs;
    for (let i = 0; i < newDirs.length; i++) {
      if (newDirs[i] == workDirPath) {
        return;
      }
    }
    newDirs.push(workDirPath);
    await window.electron.electronStore.setlist(newDirs);
    await window.electron.electronStore.getlist().then((dirs) => {
      setDirs(dirs);
    });
  };

  const getWorkDirPath = async () => {
    await window.electron.fileDialog.open().then((filePath) => {
      setWorkDirPath(filePath);
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWorkDirPath(event.target.value);
    setChanged(true);
  };

  const escapeBackslashes = (input: string): string => {
    return input.split('\\').join('\\\\');
  };

  const deleteDir = async (listIndex: number) => {
    // const deletePath = escapeBackslashes(dirs[listIndex]);
    let newDirs: string[] = dirs.filter((path, index) => {
      return index !== listIndex;
    });
    await window.electron.electronStore.setlist(newDirs);
    await window.electron.electronStore.getlist().then((ds) => {
      setDirs(ds);
    });
  };

  const setStoreSelectedIdx = async (selectedIndex: number) => {
    await window.electron.electronStore.setSelectedIndex(selectedIndex);
  };

  return (
    <>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item style={{ marginTop: 70 }}>
          <Typography variant="h4" gutterBottom>
            作業ディレクトリの設定
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Button variant="outlined" onClick={getWorkDirPath}>
            作業ディレクトリの追加
          </Button>
          <Button variant="outlined" style={{ margin: 20 }} onClick={setNewDir}>
            確定
          </Button>
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            label="作業ディレクトリ"
            variant="standard"
            value={workDirPath}
            style={{ width: 600 }}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <DirectorysList
            dirs={dirs}
            deleteAction={deleteDir}
            setSelectedIdx={setStoreSelectedIdx}
          ></DirectorysList>
          <Divider variant="middle" />
        </Grid>
        <Grid item style={{ marginTop: 30 }}>
          <Typography variant="h4" gutterBottom>
            論文メモのテンプレート設定
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
          <FormForMemoTemplate></FormForMemoTemplate>
        </Grid>
      </Grid>
    </>
  );
};

export default Setting;
