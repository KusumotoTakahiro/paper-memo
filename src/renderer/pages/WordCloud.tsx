import * as React from 'react';
import { Grid } from '@mui/material';

import { PDFMetaData } from '../../common/types';

const WordCloud = () => {
  const [dirPath, setDirPath] = React.useState<string>('');
  const [pdfs, setPdfs] = React.useState<PDFMetaData[]>([]);

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
        setPdfs(newPdfFiles);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const readTxtFile = async (filePath: string) => {
    await window.electron.fs.existTxtFile(filePath).then(async (fileExists) => {
      try {
        if (fileExists) {
          const filedata = await window.electron.fs.readTxtFile(filePath);
        } else {
          console.error('File does not exist:', filePath);
        }
      } catch (error) {
        console.error('Error during file processing', error);
      }
    });
  };

  const joinTexts = async () => {
    let pdf: PDFMetaData;
    for (let i = 0; i < pdfs.length; i++) {
      pdf = pdfs[i];
      const fl = pdf.fileName.length;
      const filePath =
        dirPath + '\\Memo\\' + pdf.fileName.slice(0, fl - 4) + '.txt';
    }
  };

  const refleshWindow = () => {
    window.electron.electronStore.getlist().then((list) => {
      window.electron.electronStore.getSelectedIndex().then((idx) => {
        setDirPath(list[idx]);
        if (dirPath !== '') {
          readDirectory();
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
