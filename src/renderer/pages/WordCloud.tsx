import * as React from 'react';
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

interface Props {
  showFlashAlert: (
    severity: string,
    message: string,
    alertTitle: string,
  ) => void;
}

const WordCloud = ({ showFlashAlert }: Props) => {
  const [dirPath, setDirPath] = React.useState<string>('');
  const [allDocuments, setAllDocuments] = React.useState<document[]>([]);
  const [openMemo, setOpenMemo] = React.useState<boolean>(true);
  const [nowMemo, setNowMemo] = React.useState<document[]>([]);
  const [nowPDF, setNowPDF] = React.useState<PDFMetaData>({
    fileName: '',
    fileSize: '0',
    pages: 0,
  });

  const refreshWindow = async () => {
    const list = await window.electron.electronStore.getlist();
    const idx = await window.electron.electronStore.getSelectedIndex();
    if (idx >= 0 && idx < list.length) {
      const newPath = list[idx];
      setDirPath(newPath);
    } else {
      console.error('Invalid index');
    }
  };

  React.useEffect(() => {
    refreshWindow();
    if (dirPath !== '') {
      const loadDocuments = async () => {
        const res = await window.electron.fs.readTxtFiles(dirPath);
        setAllDocuments(res);
      };
      loadDocuments();
    }
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

  // 一覧表示されたWordCloud
  const transApi = useSpringRef();
  const transition = useTransition(openMemo ? allDocuments : nowMemo, {
    ref: transApi,
    trail: 400 / allDocuments.length,
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0 },
    update: { opacity: 1, scale: 1 },
    config: { mass: 1, tension: 210, friction: 20 },
  });

  //左側のメモ
  const transApi3 = useSpringRef();
  const transition3 = useTransition(openMemo ? [] : [nowPDF], {
    ref: transApi3,
    keys: (item) => item.fileName,
    from: { opacity: 0, scale: 0.5 }, // 小さい状態から開始
    enter: { opacity: 1, scale: 1 }, // 通常のサイズに戻る
    leave: { opacity: 0, scale: 0 },
    config: { mass: 1, tension: 1000, friction: 20 },
  });

  useChain(
    openMemo
      ? [springApi, transApi, transApi3]
      : [transApi3, transApi, springApi],
    [0, openMemo ? 0.1 : 0.3, openMemo ? 0 : 0.1],
  );

  const displayNowMemo = (nowMemo: document) => {
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
        <>
          {nowMemo.length === 0 ? (
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
                {transition((style, item) => (
                  <animated.div style={style}>
                    <WordCloudCard
                      document={item}
                      displayNowMemo={displayNowMemo}
                      open={openMemo}
                    />
                  </animated.div>
                ))}
                {transition3((style, item) => (
                  <animated.div className="memo">
                    <MemoMarkdown nowPdf={item} dirPath={nowMemo[0].filePath} />
                  </animated.div>
                ))}
              </animated.div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default WordCloud;
