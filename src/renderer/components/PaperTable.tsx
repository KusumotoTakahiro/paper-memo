import React from 'react';
import { PDFMetaData } from '../../common/types';
import useWindowSize from './GetWindowSize';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { green, pink, blue } from '@mui/material/colors';

interface Props {
  pdfs: PDFMetaData[];
  handleNowFile: (pdf: PDFMetaData) => void;
}

const PaperTable = ({ pdfs = [], handleNowFile }: Props) => {
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  const initMemoDir = async () => {
    await window.electron.electronStore.getlist().then(async (dirs) => {
      await window.electron.electronStore
        .getSelectedIndex()
        .then(async (idx) => {
          const dirPath = dirs[idx];
          await window.electron.fs
            .makeDir(dirPath)
            .then(async (exsitMemoDir) => {
              if (!exsitMemoDir) {
                //作成済みを通知
              }
              for (let i = 0; i < pdfs.length; i++) {
                const filenamelength = (pdfs[i]?.fileName).length;
                let filePath =
                  dirPath +
                  '\\Memo\\' +
                  (pdfs[i]?.fileName).slice(0, filenamelength - 4) +
                  '.txt';
                window.electron.electronStore
                  .getMemoTemplate()
                  .then((memoTemplate) => {
                    window.electron.fs
                      .existTxtFile(filePath)
                      .then((txtIsExist) => {
                        if (!txtIsExist) {
                          console.log('new txtfile create');
                          window.electron.fs.writeTxtFile(
                            filePath,
                            memoTemplate,
                          );
                        }
                      });
                  });
              }
            });
        });
    });
  };

  React.useEffect(() => {
    window.electron.electronStore.getWindowSize().then((winSize) => {
      console.log(winSize);
    });
    initMemoDir();
  }, []);

  const handleDeleteClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    //deleteAction(index);
  };

  const handleEditClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    //deleteAction(index);
  };

  const handleFileSelect = (
    event: React.MouseEvent<HTMLDivElement>,
    index: number,
  ) => {
    setSelectedIndex(index);
    const nowPdf = pdfs[index];
    handleNowFile(nowPdf);
  };

  const generate = () => {
    return pdfs.map((pdf, index) => (
      <ListItem
        key={index}
        secondaryAction={
          <>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={(event) => {
                handleDeleteClick(event, index);
              }}
              style={{
                background: 'crimson',
                color: 'white',
              }}
            >
              <DeleteIcon />
            </IconButton>
          </>
        }
        style={index === selectedIndex ? { background: blue[100] } : {}}
      >
        <ListItemButton
          onClick={(event) => {
            handleFileSelect(event, index);
          }}
          disableRipple
        >
          <ListItemAvatar>
            <IconButton>
              {index === selectedIndex ? (
                <Avatar sx={{ bgcolor: blue[500] }}>
                  <TaskOutlinedIcon style={{ color: 'white' }} />
                </Avatar>
              ) : (
                <Avatar>
                  <TextSnippetOutlinedIcon />
                </Avatar>
              )}
            </IconButton>
          </ListItemAvatar>
          <ListItemText
            primary={`
              ${pdf.fileName} / 
              ${
                pdf.pages !== undefined || 0
                  ? pdf.pages + 'ページ'
                  : 'pages N.D'
              }/ 
              ${
                pdf.fileSize !== undefined || 0 ? pdf.fileSize : 'file size N.D'
              }
            `}
          />
        </ListItemButton>
      </ListItem>
    ));
  };
  return <List dense={dense}>{generate()}</List>;
};

export default PaperTable;
