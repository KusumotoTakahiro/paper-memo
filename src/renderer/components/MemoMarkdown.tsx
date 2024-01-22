import * as React from 'react';
import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';
import Paper from '@mui/material/Paper';
import DOMPurify from 'dompurify';
import { PDFMetaData } from '../../common/types';
import '../css/MemoMarkdown.scss';
import {
  ButtonGroup,
  Button,
  IconButton,
  Grid,
  Fade,
  TextField,
  Menu,
  MenuItem,
} from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import TableRowsIcon from '@mui/icons-material/AppsOutlined';
import CheckBoxIcon from '@mui/icons-material/CheckBoxOutlined';
import CircleIcon from '@mui/icons-material/Circle';

interface Props {
  nowPdf: PDFMetaData;
  dirPath: string;
}

const myTextAreaStyle = {
  width: '100%',
  marginTop: 10,
  padding: 0,
  fontFamily: 'serif',
  fontSize: '16px',
};

const MemoMarkdown = ({ nowPdf, dirPath }: Props) => {
  const [memoContents, setMemoContents] = React.useState<string>('');
  const [memoHTML, setMemoHTML] = React.useState<string>('');
  const [watchMD, setWatchMD] = React.useState<boolean>(true);
  const [txtFilePath, setTxtFilePath] = React.useState<string>('');
  const [textSelected, setTextSelected] = React.useState<boolean>(false);
  const [selectedText, setSelectedText] = React.useState<string>('');
  const [exitEditor, setExitEditor] = React.useState<boolean>(true);
  const [openColorPicker, setOpenCP] = React.useState<boolean>(false);
  const [openTablePicker, setOpenTP] = React.useState<boolean>(false);
  const [textColor, setTextColor] = React.useState<string>('black');
  const anchorRefColor = React.useRef<HTMLButtonElement>(null);
  const anchorRefTable = React.useRef<HTMLButtonElement>(null);

  const handleBackspace = () => {
    const textarea = document.getElementById('tarea');
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;

    if (selectionStart !== selectionEnd) {
      textarea.setRangeText('', selectionStart, selectionEnd, 'end');
      console.log(selectionStart);
      setMemoContents(textarea.value);
      textarea.focus();
    } else {
      textarea.setRangeText('', selectionStart - 1, selectionEnd, 'end');
      setMemoContents(textarea.value);
      textarea.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      if (!watchMD) {
        previewMD();
      }
    }
    // if (event.key === 'Backspace') {
    //   event.preventDefault();
    //   handleBackspace();
    // }
  };

  const handleSelect = (event: React.SyntheticEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    const selectedText = selection?.toString();

    if (selection && !!selectedText) {
      if (selectedText?.length !== 0) {
        setTextSelected(true);
        setSelectedText(selectedText);
      } else {
        setTextSelected(false);
        setSelectedText('');
      }
    } else {
      setTextSelected(false);
      setSelectedText('');
    }
  };

  const wrapWithTag = (tag: string) => {
    let textarea = document.getElementById('tarea');
    if (textarea) {
      const selectionStart = textarea.selectionStart;
      const selectionEnd = textarea.selectionEnd;
      let new_text = '';
      if (textSelected) {
        new_text += `${tag} ${selectedText}`;
      } else {
        new_text += `${tag} `;
      }
      textarea.setRangeText(new_text, selectionStart, selectionEnd);
      setMemoContents(textarea.value);
      textarea.focus();
      textarea.setSelectionRange(
        selectionStart + new_text.length,
        selectionStart + new_text.length,
      );
    }
    setTextSelected(false);
    setSelectedText('');
  };

  const wrapWithTag2 = (tag: string) => {
    let textarea = document.getElementById('tarea');
    if (textarea) {
      const selectionStart = textarea.selectionStart;
      const selectionEnd = textarea.selectionEnd;
      let new_text = '';
      if (textSelected) {
        new_text = `${tag}${selectedText}${tag}`;
      } else {
        new_text = `${tag}${tag}`;
      }
      textarea.setRangeText(new_text, selectionStart, selectionEnd);
      setMemoContents(textarea.value);
      textarea.setSelectionRange(
        selectionStart + tag.length,
        selectionStart + tag.length,
      );
      textarea.focus();
    }
    setTextSelected(false);
    setSelectedText('');
  };

  const wrapWithList = (tag: string) => {
    let textarea = document.getElementById('tarea');
    if (textarea) {
      const selectionStart = textarea.selectionStart;
      const selectionEnd = textarea.selectionEnd;
      let new_text = '';
      if (textSelected) {
        const lines = selectedText.split('\n');
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          new_text += `${tag} ${line}\n`;
        }
        console.log(selectedText);
      } else {
        new_text = `${tag} \n${tag} \n${tag} \n`;
      }
      textarea.setRangeText(new_text, selectionStart, selectionEnd);
      setMemoContents(textarea.value);
      textarea.setSelectionRange(
        selectionStart + new_text.length,
        selectionStart + new_text.length,
      );
      textarea.focus();
    }
    setTextSelected(false);
    setSelectedText('');
  };

  const wrapWithNList = () => {
    let textarea = document.getElementById('tarea');
    if (textarea) {
      const selectionStart = textarea.selectionStart;
      const selectionEnd = textarea.selectionEnd;
      let new_text = '';
      if (textSelected) {
        const lines = selectedText.split('\n');
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          new_text += `${i + 1} ${line}\n`;
        }
      } else {
        new_text = `1 \n2 \n3 \n`;
      }
      textarea.setRangeText(new_text, selectionStart, selectionEnd);
      setMemoContents(textarea.value);
      textarea.setSelectionRange(selectionStart + 2, selectionStart + 2);
      textarea.focus();
    }
    setTextSelected(false);
    setSelectedText('');
  };

  const wrapWithColor = () => {
    let textarea = document.getElementById('tarea');
    if (textarea) {
      const selectionStart = textarea.selectionStart;
      const selectionEnd = textarea.selectionEnd;
      let new_text = '';
      if (textSelected) {
        new_text += `<font color="${textColor}">${selectedText}</font>`;
        console.log(selectedText);
        textarea.setRangeText(new_text, selectionStart, selectionEnd);
        setMemoContents(textarea.value);
        textarea.setSelectionRange(
          selectionStart + new_text.length,
          selectionStart + new_text.length,
        );
        textarea.focus();
      } else {
        setOpenCP((prevOpen) => !prevOpen);
      }
    }
    setTextSelected(false);
    setSelectedText('');
  };

  const drawTable = (type: string) => {
    let textarea = document.getElementById('tarea');
    if (textarea) {
      const selectionStart = textarea.selectionStart;
      const selectionEnd = textarea.selectionEnd;
      let new_text = `| ${type} align | ${type} align | ${type} align |\n`;
      if (type === 'left') {
        new_text += `|:-----------|:------------|:------------|\n`;
      } else if (type === 'center') {
        new_text += `|-----------:|------------:|------------:|\n`;
      } else if (type === 'right') {
        new_text += `|:-----------:|:------------:|:------------:|\n`;
      }
      if (textSelected) {
        const words = selectedText.split(/\s+/);
        for (let i = 0; i < words.length; i++) {
          const word = words[i];
          new_text += `| ${word} | ${word} | ${word} |`;
        }
      } else {
        new_text += `|           |           |           |`;
      }
      textarea.setRangeText(new_text, selectionStart, selectionEnd);
      setMemoContents(textarea.value);
      textarea.setSelectionRange(
        selectionStart + new_text.length,
        selectionStart + new_text.length,
      );
      textarea.focus();
    }
    setTextSelected(false);
    setSelectedText('');
  };

  const sanitize = (memoHTML: string) => {
    return DOMPurify.sanitize(memoHTML, {
      ALLOWED_ATTR: [
        'href',
        'target',
        'rel',
        'color',
        'border',
        'align',
        'checked',
        'type',
        'disabled',
      ],
      ALLOWED_TAGS: [
        'p',
        'br',
        'ul',
        'ol',
        'li',
        'blockquote',
        'strong',
        'em',
        'a',
        'hr',
        'code',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'font',
        'table',
        'td',
        'tbody',
        'th',
        'thead',
        'tr',
        'input',
      ],
    });
  };

  const readTxtFile = async (filePath: string) => {
    await window.electron.fs.existTxtFile(filePath).then(async (fileExists) => {
      if (fileExists) {
        const filedata = await window.electron.fs.readTxtFile(filePath);
        setMemoContents(filedata);
        await window.electron.makeMD
          .makeMD(filedata)
          .then((memoHTML: string) => {
            setMemoHTML(sanitize(memoHTML));
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

  const handleColorClick = (color: string) => {
    setTextColor(color);
    setOpenCP(false);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRefColor.current &&
      anchorRefColor.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpenCP(false);
  };

  const handleBlur = (event: any) => {
    // テキストエリア内でのイベントでない場合に handleBlur を実行
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setExitEditor(true);
      setTextSelected(false);
      setSelectedText('');
    }
  };

  const handleFocus = (event: any) => {
    setExitEditor(false);
  };

  // MDプレビューを表示すると同時に，Txtファイルの編集を一旦確定させる．
  const previewMD = async () => {
    console.log('previewMD');
    await window.electron.fs.writeTxtFile(txtFilePath, memoContents);
    await window.electron.makeMD.makeMD(memoContents).then(async (memoHTML) => {
      setWatchMD(!watchMD);
      await setMemoHTML(sanitize(memoHTML));
    });
  };

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

  return (
    <>
      <div
        style={{
          position: 'fixed',
          overflow: 'auto',
          width: '48%',
          height: '90%',
        }}
      >
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
          <>
            <div tabIndex={0} onBlur={handleBlur} onFocus={handleFocus}>
              <ButtonGroup style={{ marginTop: 15 }} disabled={exitEditor}>
                <Button
                  disabled={exitEditor}
                  onClick={() => {
                    wrapWithTag('#');
                  }}
                >
                  h1
                </Button>
                <Button
                  disabled={exitEditor}
                  onClick={() => {
                    wrapWithTag('##');
                  }}
                >
                  h2
                </Button>
                <Button
                  disabled={exitEditor}
                  onClick={() => {
                    wrapWithTag('###');
                  }}
                >
                  h3
                </Button>
                <IconButton
                  disabled={exitEditor}
                  onClick={() => {
                    wrapWithTag2('**');
                  }}
                >
                  <FormatBoldIcon />
                </IconButton>
                <IconButton
                  disabled={exitEditor}
                  onClick={() => {
                    wrapWithTag2('*');
                  }}
                >
                  <FormatItalicIcon />
                </IconButton>
                <IconButton
                  disabled={exitEditor}
                  ref={anchorRefColor}
                  aria-controls={
                    openColorPicker ? 'compsition-menu' : undefined
                  }
                  aria-expanded={openColorPicker ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={() => {
                    wrapWithColor();
                  }}
                  style={{ color: textColor }}
                >
                  <FormatColorTextIcon />
                </IconButton>
                <IconButton
                  disabled={exitEditor}
                  onClick={() => {
                    wrapWithList('-');
                  }}
                >
                  <FormatListBulletedIcon />
                </IconButton>
                <IconButton
                  disabled={exitEditor}
                  onClick={() => {
                    wrapWithNList();
                  }}
                >
                  <FormatListNumberedIcon />
                </IconButton>
                <IconButton
                  disabled={exitEditor}
                  onClick={() => {
                    wrapWithTag('>');
                  }}
                >
                  <FormatQuoteIcon />
                </IconButton>
                <IconButton
                  disabled={exitEditor}
                  onClick={() => {
                    drawTable('center');
                  }}
                >
                  <TableRowsIcon />
                </IconButton>
                <IconButton
                  disabled={exitEditor}
                  onClick={() => {
                    wrapWithList('- [ ] ');
                  }}
                >
                  <CheckBoxIcon />
                </IconButton>
              </ButtonGroup>
              <Menu
                anchorEl={anchorRefColor.current}
                open={openColorPicker}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                <Grid container>
                  <Grid item>
                    <MenuItem
                      onClick={() => handleColorClick('black')}
                      style={{ color: 'black' }}
                    >
                      <CircleIcon />
                    </MenuItem>
                  </Grid>
                  <Grid item>
                    <MenuItem
                      onClick={() => handleColorClick('crimson')}
                      style={{ color: 'crimson' }}
                    >
                      <CircleIcon />
                    </MenuItem>
                  </Grid>
                  <Grid item>
                    <MenuItem
                      onClick={() => handleColorClick('dodgerblue')}
                      style={{ color: 'dodgerblue' }}
                    >
                      <CircleIcon />
                    </MenuItem>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item>
                    <MenuItem
                      onClick={() => handleColorClick('gold')}
                      style={{ color: 'gold' }}
                    >
                      <CircleIcon />
                    </MenuItem>
                  </Grid>
                  <Grid item>
                    <MenuItem
                      onClick={() => handleColorClick('forestgreen')}
                      style={{ color: 'forestgreen' }}
                    >
                      <CircleIcon />
                    </MenuItem>
                  </Grid>
                  <Grid item>
                    <MenuItem
                      onClick={() => handleColorClick('darkorange')}
                      style={{ color: 'darkorange' }}
                    >
                      <CircleIcon />
                    </MenuItem>
                  </Grid>
                </Grid>
              </Menu>
              <TextField
                multiline
                rows={25}
                style={myTextAreaStyle}
                onChange={handleOnChange}
                onKeyDown={handleKeyDown}
                onSelect={handleSelect}
                value={memoContents}
                id="tarea"
              />
            </div>
          </>
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
                className="mymemo"
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
