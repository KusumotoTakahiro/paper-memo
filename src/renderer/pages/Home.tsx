import * as React from 'react';
import Grid from '@mui/material/Grid';
import { useDropzone } from 'react-dropzone';

import SearchBar from '../components/SearchBar';
import PaperTable from '../components/PaperTable';
import MemoMarkdown from '../components/MemoMarkdown';
import { PDFMetaData } from '../../common/types';

const Home = () => {
  const [dirPath, setDirPath] = React.useState<string>('');
  const [pdfs, setPdfs] = React.useState<PDFMetaData[]>([]);
  const [delFlag, setDelFlag] = React.useState<number>(0);
  const [winSize, setWinSize] = React.useState<Number[]>([0, 0]);
  const [nowPdf, setNowPdf] = React.useState<PDFMetaData>({
    fileName: 'undefined',
    pages: -1,
    fileSize: '0',
  });

  const onDrop = React.useCallback(async (acceptedFiles: any) => {
    await window.electron.electronStore.getlist().then((list) => {
      window.electron.electronStore.getSelectedIndex().then(async (idx) => {
        const droppedFile = acceptedFiles[0];
        const path: string = droppedFile.path;
        const name: string = droppedFile.name;
        const savePath: string = `${list[idx]}\\${name}`;
        await window.electron.fs.copyFile(path, savePath);
        console.log(path);
        console.log(savePath);
      });
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
  });

  const searchPDF = (searchQuery: string) => {
    return 0;
  };

  const handleNowFile = async (pdfFile: PDFMetaData) => {
    setNowPdf(pdfFile);
    console.log(pdfFile);
  };

  const setDelFlagRupper = () => {
    setDelFlag(delFlag + 1);
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
        setPdfs(newPdfFiles);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  React.useEffect(() => {
    window.electron.electronStore.getlist().then((list) => {
      window.electron.electronStore.getSelectedIndex().then((idx) => {
        setDirPath(list[idx]);
        if (dirPath !== '') {
          readDirectory();
        }
      });
    });
  }, [dirPath, delFlag]);

  return (
    <>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sm={6}
            style={{
              marginTop: 70,
            }}
          >
            {pdfs?.length > 0 && (
              <PaperTable
                pdfs={pdfs}
                handleNowFile={handleNowFile}
                setDirFlag={setDelFlagRupper}
              ></PaperTable>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            {/* <Grid
            container
            spacing={2}
            direction="row-reverse"
            justifyContent="flex-start"
            alignItems="flex-end"
          >
            <Grid item>
              <SearchBar onSearch={searchPDF} />
            </Grid>
          </Grid> */}
            <MemoMarkdown nowPdf={nowPdf} dirPath={dirPath} />
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Home;
