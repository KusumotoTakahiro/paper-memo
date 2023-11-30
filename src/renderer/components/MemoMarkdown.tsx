import * as React from 'react';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import DOMPurify from 'dompurify';
import { PDFMetaData } from '../../common/types';

interface Props {
  nowPdf: PDFMetaData;
  dirPath: string;
}

const MemoMarkdown = ({ nowPdf, dirPath }: Props) => {
  const [memoContents, setMemoContents] = React.useState<string>('');
  const [memoHTML, setMemoHTML] = React.useState<string>('');
  const [watchMD, setWatchMD] = React.useState<boolean>(false);
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
    // const filedata = await window.electron.fs.readTxtFile(filePath);
    // setMemoContents(filedata);
    // console.log(filedata);
    await window.electron.fs.existTxtFile(filePath).then(async (fileExists) => {
      if (fileExists) {
        const filedata = await window.electron.fs.readTxtFile(filePath);
        setMemoContents(filedata);
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
    await window.electron.makeMD.makeMD(memoContents).then(async (memoHTML) => {
      setWatchMD(true);
      setMemoHTML(DOMPurify.sanitize(memoHTML));
      await window.electron.fs.writeTxtFile(txtFilePath, memoContents);
    });
  };

  return (
    <>
      <Typography variant="subtitle1">論文メモ</Typography>
      {watchMD === false ? (
        <TextField
          multiline
          rows={10}
          style={{
            width: 500,
            marginTop: 20,
          }}
          onChange={handleOnChange}
          defaultValue={memoContents}
        />
      ) : (
        <Paper
          variant="outlined"
          style={{
            marginRight: 20,
            padding: 20,
            width: 500,
          }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: memoHTML,
            }}
          ></div>
        </Paper>
      )}
      {watchMD === false ? (
        <Button
          variant="outlined"
          onClick={previewMD}
          style={{
            margin: 20,
          }}
        >
          編集確定
        </Button>
      ) : (
        <Button
          variant="outlined"
          onClick={() => {
            setWatchMD(false);
          }}
          style={{
            margin: 20,
          }}
        >
          編集再開
        </Button>
      )}
    </>
  );
};

export default MemoMarkdown;
