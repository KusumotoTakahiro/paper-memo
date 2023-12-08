import * as React from 'react';
import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import DOMPurify from 'dompurify';
import { PDFMetaData } from '../../common/types';
import Grid from '@mui/material/Grid';
import Fade from '@mui/material/Fade';

interface Props {
  nowPdf: PDFMetaData;
  dirPath: string;
}

const MemoMarkdown = ({ nowPdf, dirPath }: Props) => {
  const [memoContents, setMemoContents] = React.useState<string>('');
  const [memoHTML, setMemoHTML] = React.useState<string>('');
  const [watchMD, setWatchMD] = React.useState<boolean>(true);
  const [txtFilePath, setTxtFilePath] = React.useState<string>('');

  React.useEffect(() => {
    const fetchPdfData = async () => {
      const fl = nowPdf.fileName.length;
      const filePath =
        dirPath + '\\Memo\\' + nowPdf.fileName.slice(0, fl - 4) + '.txt';
      setTxtFilePath(filePath);
      await readTxtFile(filePath);
    };
    fetchPdfData();
  }, [nowPdf, dirPath]);

  const readTxtFile = async (filePath: string) => {
    await window.electron.fs.existTxtFile(filePath).then(async (fileExists) => {
      if (fileExists) {
        const filedata = await window.electron.fs.readTxtFile(filePath);
        setMemoContents(filedata);
        await window.electron.makeMD
          .makeMD(filedata)
          .then((memoHTML: string) => {
            setMemoHTML(DOMPurify.sanitize(memoHTML));
          });
        setWatchMD(true);
      } else {
        console.error('File does not exist:', filePath);
      }
    });
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMemoContents(event.target.value);
  };

  // MDプレビューを表示すると同時に，Txtファイルの編集を一旦確定させる．
  const previewMD = async () => {
    // メモを.txtに保存する.
    await window.electron.fs.writeTxtFile(txtFilePath, memoContents);
    console.log(memoContents);
    await window.electron.makeMD.makeMD(memoContents).then(async (memoHTML) => {
      setWatchMD(!watchMD);
      await setMemoHTML(DOMPurify.sanitize(memoHTML));
    });
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          overflow: 'auto',
          width: '40%',
          height: '90%',
        }}
      >
        {/* <Typography variant="subtitle1">論文メモ</Typography> */}
        <Grid
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          <Grid item>
            {memoContents === '' ? (
              <></>
            ) : (
              <Fade in={true} timeout={1000}>
                <Fab
                  size="small"
                  aria-label="edit"
                  onClick={previewMD}
                  style={{
                    color: watchMD === false ? 'black' : 'white',
                    backgroundColor: watchMD === false ? 'white' : '#abb8de',
                    right: 30,
                    top: 10,
                  }}
                >
                  <EditIcon />
                </Fab>
              </Fade>
            )}
          </Grid>
        </Grid>
        {watchMD === false ? (
          <TextField
            multiline
            minRows={10}
            style={{
              width: '100%',
              marginTop: 20,
              padding: 0,
              fontFamily: 'serif',
              fontSize: '16px',
            }}
            onChange={handleOnChange}
            value={memoContents}
          />
        ) : memoContents === '' ? (
          <></>
        ) : (
          <Fade in={true} timeout={1000}>
            <Paper
              variant="outlined"
              style={{
                width: '95%',
                marginTop: 20,
                right: 10,
                padding: 10,
                fontFamily: 'serif',
                fontSize: '16px',
              }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: memoHTML,
                }}
              ></div>
            </Paper>
          </Fade>
        )}
      </div>
    </>
  );
};

export default MemoMarkdown;
