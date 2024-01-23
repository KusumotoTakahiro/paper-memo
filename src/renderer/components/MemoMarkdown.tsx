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
  MenuList,
  MenuItem,
  Popper,
  ClickAwayListener,
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
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';

interface Props {
  nowPdf: PDFMetaData;
  dirPath: string;
}

const MemoMarkdown = ({ nowPdf, dirPath }: Props) => {
  const [init, setInit] = React.useState<boolean>(false);
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
    const textarea = document.getElementById('tarea') as HTMLTextAreaElement;
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;

    if (selectionStart !== selectionEnd) {
      textarea.setRangeText('', selectionStart, selectionEnd, 'end');
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
    let textarea = document.getElementById('tarea') as HTMLTextAreaElement;
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
    let textarea = document.getElementById('tarea') as HTMLTextAreaElement;
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
    let textarea = document.getElementById('tarea') as HTMLTextAreaElement;
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
    let textarea = document.getElementById('tarea') as HTMLTextAreaElement;
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
    let textarea = document.getElementById('tarea') as HTMLTextAreaElement;
    if (textarea) {
      const selectionStart = textarea.selectionStart;
      const selectionEnd = textarea.selectionEnd;
      let new_text = '';
      if (textSelected) {
        new_text += `<font color="${textColor}">${selectedText}</font>`;
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

  const trimSpace = (x: string) => {
    return x.replace(/^[\s　]+|[\s　]+$/g, '');
  };

  /**
   * 表作成の関数
   * @param type (string): 表のセルを左，中央，右のどれで揃えるかを指定する．
   *
   * <表の作成方針>
   * (1) テキストの未選択時 → 空の1行3列の表を作成する．
   * (2) テキスト選択時
   * 　 (2-1) 1行の時: 単語数をNを算出し，1行N列の表を作成する．
   * 　 (2-2) 複数行(Ｍ行)の時: 行ごとに単語数を算出し，最大の単語数をNとしたとき，M行N列の表を作成する．
   *
   * <単語の算出方針>
   * 改行コードをもとに行を分割する．
   * (1行選択の時は改行コードがなく分割されないのでそのまま）
   *
   * 1行で前後に空白（半角，全角）を含むものはトリムする．(trimSpace()でトリムは実装している)
   * トリム済みの行に対して空白（半角，全角）を区切り文字に行を単語に分割する．
   * ※ 空白を区切り文字に指定している理由は
   * 　 文章をセルに入れたい場合にカンマだと意図しない区切りが発生するから．
   */
  const drawTable = (type: string) => {
    let textarea = document.getElementById('tarea') as HTMLTextAreaElement;
    if (textarea) {
      const selectionStart = textarea.selectionStart;
      const selectionEnd = textarea.selectionEnd;
      let new_text = `|`;
      let lines = [];
      let words = [];
      if (textSelected) {
        lines = trimSpace(selectedText).split('\n');
        // 行ごとに単語数を数えて最も単語数で表を作成する．
        let max_words = 0;
        for (let i = 0; i < lines.length; i++) {
          words = trimSpace(lines[0]).split(/\s+/);
          if (max_words < words.length) max_words = words.length;
        }
        // Tableのheader生成
        for (let i = 0; i < max_words; i++) {
          new_text += `           |`;
        }
        new_text += '\n|';
        // Tableのalign設定の生成
        for (let i = 0; i < words.length; i++) {
          if (type === 'left') {
            new_text += `:-----------|`;
          } else if (type === 'center') {
            new_text += `:-----------:|`;
          } else if (type === 'right') {
            new_text += `-----------:|`;
          }
        }
        new_text += `\n`;
        // Tableのセルを行ごとに生成
        for (let i = 0; i < lines.length; i++) {
          new_text += '|';
          words = trimSpace(lines[i]).split(/\s+/);
          for (let j = 0; j < words.length; j++) {
            new_text += ` ${words[j]} |`;
          }
          new_text += '\n';
        }
      }
      // 文字列の選択がない場合は3行3列の表を生成.
      else {
        new_text = `|           |           |           |\n`;
        if (type === 'left') {
          new_text += `|:-----------|:------------|:------------|\n`;
        } else if (type === 'center') {
          new_text += `|-----------:|------------:|------------:|\n`;
        } else if (type === 'right') {
          new_text += `|:-----------:|:------------:|:------------:|\n`;
        }
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
    setOpenTP(false);
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
      try {
        if (fileExists) {
          const filedata = await window.electron.fs.readTxtFile(filePath);
          setMemoContents(filedata);
          // Filedataが選択されるまではinit=falseで右画面を空にしておく．
          if (filedata !== '') {
            setInit(true);
          }
          await window.electron.makeMD
            .makeMD(filedata)
            .then((memoHTML: string) => {
              setMemoHTML(sanitize(memoHTML));
            });
          setWatchMD(true);
        } else {
          console.error('File does not exist:', filePath);
        }
      } catch (error) {
        console.error('Error during file processing', error);
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

  const handleTableClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setOpenTP(!openTablePicker);
  };

  const handleCloseCP = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRefColor.current &&
      anchorRefColor.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpenCP(false);
  };

  const handleCloseTP = (event: Event | React.SyntheticEvent) => {
    event.stopPropagation();
    if (
      anchorRefColor.current &&
      anchorRefColor.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpenTP(false);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.isPropagationStopped()) {
      return;
    }
    const popperButtons = document.querySelectorAll('.ribon-btn');
    const popperContent = document.getElementById('popper-content');

    if (
      popperContent &&
      Array.from(popperButtons).some((button) =>
        button.contains(event.target),
      ) &&
      !popperContent.contains(event.target)
    ) {
      return;
    }
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setExitEditor(true);
      setTextSelected(false);
      setSelectedText('');
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setExitEditor(false);
  };

  // MDプレビューを表示すると同時に，Txtファイルの編集を一旦確定させる．
  const previewMD = async () => {
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
            {!init && memoContents === '' ? (
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
              <ButtonGroup className="ribon ribon-btn" disabled={exitEditor}>
                <IconButton
                  disabled={exitEditor}
                  onClick={() => {
                    wrapWithTag('#');
                  }}
                >
                  <span>h1</span>
                </IconButton>
                <IconButton
                  disabled={exitEditor}
                  onClick={() => {
                    wrapWithTag('##');
                  }}
                >
                  <span>h2</span>
                </IconButton>
                <IconButton
                  disabled={exitEditor}
                  onClick={() => {
                    wrapWithTag('###');
                  }}
                >
                  <span>h3</span>
                </IconButton>
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
                  className="ribon-btn"
                  disabled={exitEditor}
                  ref={anchorRefTable}
                  aria-controls={
                    openColorPicker ? 'compsition-menu' : undefined
                  }
                  aria-expanded={openColorPicker ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleTableClick}
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
              <Popper
                open={openTablePicker}
                anchorEl={anchorRefTable.current}
                role={undefined}
                placement="bottom"
                className="tableMenu"
                id="popper-content"
              >
                <ClickAwayListener onClickAway={handleCloseTP}>
                  <ButtonGroup className="ribon ribon-btn">
                    <IconButton
                      className="ribon-btn"
                      onClick={() => drawTable('left')}
                    >
                      <FormatAlignLeftIcon />
                    </IconButton>
                    <IconButton
                      className="ribon-btn"
                      onClick={() => drawTable('center')}
                    >
                      <FormatAlignCenterIcon />
                    </IconButton>
                    <IconButton
                      className="ribon-btn"
                      onClick={() => drawTable('right')}
                    >
                      <FormatAlignRightIcon />
                    </IconButton>
                  </ButtonGroup>
                </ClickAwayListener>
              </Popper>
              <Menu
                anchorEl={anchorRefColor.current}
                open={openColorPicker}
                onClose={handleCloseCP}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                className="colorMenu"
                id="my-menu"
              >
                <Grid container>
                  <Grid item>
                    <MenuItem
                      onClick={() => handleColorClick('crimson')}
                      style={{ color: 'crimson' }}
                    >
                      <CircleIcon style={{ fontSize: '40px' }} />
                    </MenuItem>
                  </Grid>
                  <Grid item>
                    <MenuItem
                      onClick={() => handleColorClick('dodgerblue')}
                      style={{ color: 'dodgerblue' }}
                    >
                      <CircleIcon style={{ fontSize: '40px' }} />
                    </MenuItem>
                  </Grid>
                  <Grid item>
                    <MenuItem
                      onClick={() => handleColorClick('saddlebrown')}
                      style={{ color: 'saddlebrown' }}
                    >
                      <CircleIcon style={{ fontSize: '40px' }} />
                    </MenuItem>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item>
                    <MenuItem
                      onClick={() => handleColorClick('gold')}
                      style={{ color: 'gold' }}
                    >
                      <CircleIcon style={{ fontSize: '40px' }} />
                    </MenuItem>
                  </Grid>
                  <Grid item>
                    <MenuItem
                      onClick={() => handleColorClick('forestgreen')}
                      style={{ color: 'forestgreen' }}
                    >
                      <CircleIcon style={{ fontSize: '40px' }} />
                    </MenuItem>
                  </Grid>
                  <Grid item>
                    <MenuItem
                      onClick={() => handleColorClick('darkorange')}
                      style={{ color: 'darkorange' }}
                    >
                      <CircleIcon style={{ fontSize: '40px' }} />
                    </MenuItem>
                  </Grid>
                </Grid>
              </Menu>
              <TextField
                multiline
                rows={25}
                style={{
                  width: '100%',
                  marginTop: 10,
                  padding: 0,
                  fontFamily: 'serif',
                  fontSize: '16px',
                }}
                onChange={handleOnChange}
                onKeyDown={handleKeyDown}
                onSelect={handleSelect}
                value={memoContents}
                id="tarea"
              />
            </div>
          </>
        ) : init === false && memoContents === '' ? (
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
