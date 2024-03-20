import * as React from 'react';
import { Grid } from '@mui/material';
import WordCloudCard from '../components/WordCloudCard';

const WordCloud = () => {
  const [dirPath, setDirPath] = React.useState<string>('');
  const [allDocuments, setAllDocuments] = React.useState<
    { name: string; value: number }[][]
  >([]);

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

  const generate = () => {
    return allDocuments.map((doc, index) => (
      <Grid item sm={4}>
        <WordCloudCard tfidfTokens={doc} />
      </Grid>
    ));
  };

  React.useEffect(() => {
    refleshWindow();
  }, [dirPath]);

  return (
    <>
      {allDocuments.length === 0 ? (
        <>データ更新中</>
      ) : (
        <Grid container spacing={2}>
          {generate()}
        </Grid>
      )}
    </>
  );
};

export default WordCloud;
