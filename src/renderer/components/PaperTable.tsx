import React from 'react';
import { PDFMetaData } from '../../common/types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import { TransitionGroup } from 'react-transition-group';
import IconButton from '@mui/material/IconButton';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ContextMenu from './ContextMenu';

interface Props {
  pdfs: PDFMetaData[];
  handleNowFile: (pdf: PDFMetaData) => void;
  setDirFlag: () => void;
  showFlashAlert: (
    severity: string,
    message: string,
    alertTitle: string,
  ) => void;
}

const PaperTable = ({
  pdfs = [],
  handleNowFile,
  setDirFlag,
  showFlashAlert,
}: Props) => {
  const [dense, setDense] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [dirPath, setDirPath] = React.useState('');

  const initMemoDir = async () => {
    await window.electron.electronStore.getlist().then(async (dirs) => {
      await window.electron.electronStore
        .getSelectedIndex()
        .then(async (idx) => {
          const dirPath = dirs[idx];
          await setDirPath(dirPath);
          await window.electron.fs
            .makeDir(dirPath)
            .then(async (exsitMemoDir) => {
              for (let i = 0; i < pdfs.length; i++) {
                const fl = (pdfs[i]?.fileName).length;
                let filePath =
                  dirPath +
                  '\\Memo\\' +
                  (pdfs[i]?.fileName).slice(0, fl - 4) +
                  '.txt';
                await window.electron.electronStore
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
    initMemoDir();
    console.log('papertable init memo dir!');
  }, [pdfs]);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    //
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
      <Collapse key={index}>
        <ListItem
          key={index}
          secondaryAction={
            index === selectedIndex ? (
              // <IconButton
              //   edge="end"
              //   aria-label="menu"
              //   onClick={(event) => {
              //     handleMenuClick(event, index);
              //   }}
              // >
              //   <MoreVertIcon />
              // </IconButton>
              <ContextMenu
                filePath={`${dirPath}\\${pdfs[index]?.fileName}`}
                dirPath={dirPath}
                setDirFlag={setDirFlag}
                showFlashAlert={showFlashAlert}
              ></ContextMenu>
            ) : (
              <></>
            )
          }
          sx={
            index === selectedIndex
              ? {
                  background: '#abb8de',
                  borderRadius: '15px 35px 15px 35px',
                  transition: 'background-color 0.3s ease-in-out',
                }
              : {}
          }
        >
          <ListItemButton
            onClick={(event) => {
              handleFileSelect(event, index);
            }}
            disableRipple
            sx={
              index === selectedIndex
                ? {
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  }
                : {
                    '&:hover': {
                      borderRadius: '15px',
                      backgroundColor: 'rgba(171, 184, 222, 0.5)',
                    },
                  }
            }
          >
            <ListItemAvatar>
              <IconButton>
                {index === selectedIndex ? (
                  <Avatar
                    style={{
                      background: 'white',
                      transition: 'background-color 0.3s ease-in-out',
                    }}
                  >
                    <TaskOutlinedIcon
                      fontSize="large"
                      style={{ color: '#d1abde' }}
                    />
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
      </Collapse>
    ));
  };
  return (
    <List dense={dense}>
      <TransitionGroup>{generate()}</TransitionGroup>
    </List>
  );
};

export default PaperTable;
