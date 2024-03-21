import * as React from 'react';
import { Box, Grid } from '@mui/material';
import {
  useTransition,
  useSpring,
  useChain,
  config,
  animated,
  useSpringRef,
} from '@react-spring/web';
import WordCloudCard from '../components/WordCloudCard';
import MemoMarkdown from '../components/MemoMarkdown';
import { document, PDFMetaData } from '../../common/types';
import '../css/WordCloud.css';

const WordCloud = () => {
  const [dirPath, setDirPath] = React.useState<string>('');
  const [allDocuments, setAllDocuments] = React.useState<document[]>([]);
  const [openMemo, setOpenMemo] = React.useState<boolean>(true);
  const [nowMemo, setNowMemo] = React.useState<document[]>([]);
  const [nowPDF, setNowPDF] = React.useState<PDFMetaData>({
    fileName: '',
    fileSize: '0',
    pages: 0,
  });

  const refleshWindow = () => {
    window.electron.electronStore.getlist().then((list) => {
      window.electron.electronStore.getSelectedIndex().then(async (idx) => {
        setDirPath(list[idx]);
        if (dirPath !== '') {
          window.electron.fs.readTxtFiles(dirPath).then((res) => {
            console.log(res);
            setAllDocuments(res);
          });
        }
      });
    });
  };

  React.useEffect(() => {
    refleshWindow();
  }, [dirPath]);

  const springApi = useSpringRef();
  const { size, ...rest } = useSpring({
    ref: springApi,
    config: config.wobbly,
    from: { size: '100%', background: 'white' },
    to: {
      size: openMemo ? '100%' : '100%',
      background: openMemo ? 'white' : 'white',
    },
  });

  const transApi = useSpringRef();
  const transition = useTransition(openMemo ? allDocuments : [], {
    ref: transApi,
    trail: 400 / allDocuments.length,
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0 },
  });

  const transApi2 = useSpringRef();
  const transition2 = useTransition(openMemo ? [] : nowMemo, {
    ref: transApi2,
    keys: (item) => item.id, // 仮に `id` が一意の識別子だとします
    trail: 200 / (nowMemo.length === 0 ? 1 : 0),
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0 },
  });

  const transApi3 = useSpringRef();
  const transition3 = useTransition(openMemo ? [] : [nowPDF], {
    ref: transApi3,
    keys: (item) => item.fileName, // `fileName` をキーとします
    trail: 10 / (nowPDF ? 1 : 0),
    from: { opacity: 0, scale: 0.5 }, // 小さい状態から開始
    enter: { opacity: 1, scale: 1 }, // 通常のサイズに戻る
    leave: { opacity: 0, scale: 0 },
    config: { mass: 1, tension: 210, friction: 20 }, // アニメーションの感触を調整
  });

  useChain(
    openMemo
      ? [springApi, transApi, transApi2, transApi3]
      : [transApi2, transApi3, transApi, springApi],
    [0, openMemo ? 0.1 : 0.6, openMemo ? 0 : 0.9, openMemo ? 0 : 1.2],
  );

  const displayNowMemo = (nowMemo: document) => {
    console.log('nowOpen: ' + String(openMemo));
    if (openMemo) {
      setNowMemo([nowMemo]);
      let temp = nowPDF;
      temp.fileName = nowMemo.fileName;
      setNowPDF(temp);
    } else setNowMemo([]);
    setOpenMemo(!openMemo);
  };

  return (
    <>
      {allDocuments.length === 0 ? (
        <>データ更新中</>
      ) : (
        <div
          style={{
            marginTop: 70,
          }}
          className="wrapper"
        >
          <animated.div
            style={{ ...rest, width: size, height: size }}
            className="container"
          >
            {transition((style, item) => (
              <animated.div style={style}>
                <WordCloudCard
                  document={item}
                  displayNowMemo={displayNowMemo}
                  open={openMemo}
                />
              </animated.div>
            ))}
          </animated.div>
        </div>
      )}
      {nowMemo.length === 0 ? (
        <></>
      ) : (
        <div
          style={{
            marginTop: 70,
          }}
          className="wrapper"
        >
          <animated.div
            style={{ ...rest, width: size, height: size }}
            className="container2"
          >
            {transition2((style, item) => (
              <animated.div>
                <WordCloudCard
                  document={item}
                  displayNowMemo={displayNowMemo}
                  open={openMemo}
                />
              </animated.div>
            ))}
            {nowMemo.length === 0 ? (
              <></>
            ) : (
              <>
                {transition3((style, item) => (
                  <animated.div style={style} className="memo">
                    <MemoMarkdown nowPdf={item} dirPath={nowMemo[0].filePath} />
                  </animated.div>
                ))}
              </>
            )}
          </animated.div>
        </div>
      )}
    </>
  );
};

export default WordCloud;
