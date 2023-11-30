import * as React from 'react';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import DOMPurify from 'dompurify';

const FormForMemoTemplate = () => {
  const [memoContents, setMemoContents] = React.useState<string>('');
  const [memoHTML, setMemoHTML] = React.useState<string>('');
  const [watchMD, setWatchMD] = React.useState<boolean>(false);
  React.useEffect(() => {
    window.electron.electronStore.getMemoTemplate().then((memoTemplate) => {
      setMemoContents(memoTemplate);
      console.log(memoTemplate);
    });
  }, []);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMemoContents(event.target.value);
  };
  const handleOnClick = () => {
    window.electron.electronStore.setMmoTemplate(memoContents);
  };

  const previewMD = async () => {
    await window.electron.makeMD.makeMD(memoContents).then((memoHTML) => {
      setWatchMD(true);
      setMemoHTML(DOMPurify.sanitize(memoHTML));
    });
  };

  return (
    <>
      <Card
        style={{
          width: 600,
          marginBottom: 50,
        }}
      >
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={12} sm={12}>
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
                  margin: 10,
                  padding: 1,
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
          </Grid>
          <Grid item xs={12} sm={12}>
            <Button
              variant="outlined"
              onClick={handleOnClick}
              style={{
                margin: 20,
              }}
            >
              テンプレートを保存
            </Button>
            {watchMD === false ? (
              <Button
                variant="outlined"
                onClick={previewMD}
                style={{
                  margin: 20,
                }}
              >
                MDプレビュー
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
                MDアンプレビュー
              </Button>
            )}
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default FormForMemoTemplate;
