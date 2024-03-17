import * as React from 'react';
import { Grid } from '@mui/material';

const WordCloud = () => {
  const [dirPath, setDirPath] = React.useState<string>('');
  const [allDocuments, setAllDocuments] = React.useState<string[][]>([]);

  const refleshWindow = () => {
    window.electron.electronStore.getlist().then((list) => {
      window.electron.electronStore.getSelectedIndex().then(async (idx) => {
        setDirPath(list[idx]);
        if (dirPath !== '') {
          window.electron.fs.readTxtFiles(dirPath).then((res) => {
            console.log(res);
            setAllDocuments(res);
          });
        }
      });
    });
  };

  React.useEffect(() => {
    refleshWindow();
  }, [dirPath]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item sm={6}></Grid>
        <Grid item sm={6}></Grid>
      </Grid>
    </>
  );
};

export default WordCloud;
