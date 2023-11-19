import * as React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import SearchBar from '../components/SearchBar';
import { PDFMetaData } from '../../common/types';

const Home = () => {
  const [dirPath, setDirPath] = React.useState<string>('');
  const [pdfMetaData, setPdfMetaData] = React.useState<PDFMetaData[]>();

  const searchPDF = (searchQuery: string) => {
    return 0;
  };

  const readDirectory = async () => {
    await window.electron.fs
      .readFolderPDF(dirPath)
      .then(async (pdfFiles) => {
        let newPdfFiles: PDFMetaData[] = [];
        let pdf: string;
        let pdfFile: PDFMetaData;
        for (let i = 0; i < pdfFiles.length; i++) {
          pdf = pdfFiles[i];
          await window.electron.PDFmetaData.getInfo(dirPath, pdf)
            .then((metaData: PDFMetaData) => {
              pdfFile = {
                fileName: pdf,
                pages: metaData['pages'],
                fileSize: metaData['fileSize'],
              };
              newPdfFiles.push(pdfFile);
            })
            .catch((err) => {
              console.error(err);
            });
        }
        console.log(newPdfFiles);
        setPdfMetaData(newPdfFiles);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  React.useEffect(() => {
    setDirPath('C:\\Users\\ganta\\testFolderforPaparMemo');
    if (dirPath !== '') {
      readDirectory();
    }
  }, [dirPath]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sm={8}
          style={{
            backgroundColor: 'red',
            marginTop: 70,
          }}
        ></Grid>
        <Grid
          item
          xs={12}
          sm={4}
          style={{
            backgroundColor: 'blue',
          }}
        >
          <Grid
            container
            spacing={2}
            direction="row-reverse"
            justifyContent="flex-start"
            alignItems="flex-end"
          >
            <Grid
              item
              style={{
                backgroundColor: 'yellow',
              }}
            >
              <SearchBar onSearch={searchPDF} />
            </Grid>
          </Grid>
          論文メモ
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
