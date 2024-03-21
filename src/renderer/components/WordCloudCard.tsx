import * as React from 'react';
import { Card, CardActionArea, Typography, Button } from '@mui/material';
import * as echarts from 'echarts';
import 'echarts-wordcloud';
import { document } from '../../common/types';

interface Props {
  document: document;
  displayNowMemo: (memo: document) => void;
  open: boolean;
}

const WordCloudCard = ({ document, displayNowMemo, open }: Props) => {
  const chartRef = React.useRef(null); // ref を作成
  React.useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current); // ref を使用してチャートを初期化
      chart.setOption(option);
    }

    return () => {
      if (chartRef.current) echarts.dispose(chartRef.current);
    };
  }, [document]); // tfidfTokens が変更されたときに再実行
  const option = {
    tooltip: {},
    series: [
      {
        type: 'wordCloud',
        gridSize: 8,
        sizeRange: [8, 80],
        rotationRange: [0, 0],
        // rotationStep: 90,
        shape:
          document.wordNumber > 250
            ? 'square'
            : document.wordNumber < 100
            ? 'triangle'
            : 'circle',
        left: 'center',
        top: 'center',
        width: '90%',
        height: '80%',
        right: 'center',
        bottom: null,
        drawOutOfBound: false,
        layoutAnimation: true,
        textStyle: {
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          color() {
            return `rgb(${[
              Math.round(Math.random() * 20),
              Math.round(Math.random() * 150),
              Math.round(Math.random() * 180),
            ].join(',')})`;
          },
        },
        emphasis: {
          focus: 'self',
          textStyle: {
            shadowBlur: 10,
            shadowColor: '#333',
          },
        },
        data: document.tokens,
      },
    ],
  };

  return (
    <>
      <Card
        sx={{ height: 400, position: 'relative' }}
        key={document.id}
        elevation={5}
      >
        <Typography sx={{ fontSize: 14 }}>{document.fileName}</Typography>
        {document.tokens.length === 0 ? (
          <Typography
            sx={{
              color: 'grey',
              margin: 'auto',
              fontSize: 14,
            }}
          >
            表示できるデータがありません
          </Typography>
        ) : (
          <div
            ref={chartRef}
            style={{ width: '100%', height: '90%', margin: 0 }}
          ></div>
        )}
        <Typography sx={{ position: 'absolute', bottom: 0, left: 10 }}>
          全トークン数 : {document.wordNumber}単語
        </Typography>
        <Typography sx={{ position: 'absolute', bottom: 0, right: 10 }}>
          文字数 : {document.fileContent.length}字
        </Typography>
        <CardActionArea sx={{ position: 'absolute', bottom: 20 }}>
          <Button onClick={(e) => displayNowMemo(document)}>編集</Button>
        </CardActionArea>
      </Card>
    </>
  );
};

export default WordCloudCard;
