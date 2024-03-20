import * as React from 'react';
import { Card } from '@mui/material';
import * as echarts from 'echarts';
import 'echarts-wordcloud';

interface Props {
  tfidfTokens: { name: string; value: number }[];
}

const WordCloudCard = ({ tfidfTokens }: Props) => {
  const chartRef = React.useRef(null); // ref を作成
  React.useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current); // ref を使用してチャートを初期化
      chart.setOption(option);
    }

    return () => {
      if (chartRef.current) echarts.dispose(chartRef.current);
    };
  }, [tfidfTokens]); // tfidfTokens が変更されたときに再実行
  const option = {
    tooltip: {},
    series: [
      {
        type: 'wordCloud',
        gridSize: 8,
        sizeRange: [8, 80],
        rotationRange: [0, 0],
        // rotationStep: 90,
        shape: 'square',
        left: 'center',
        top: 'center',
        width: '90%',
        height: '80%',
        right: 'center',
        bottom: 'center',
        drawOutOfBound: true,
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
        data: tfidfTokens,
      },
    ],
  };

  return (
    <>
      <Card sx={{ height: 400 }}>
        {tfidfTokens.length === 0 ? (
          <>表示できるデータがありません</>
        ) : (
          <div ref={chartRef} style={{ width: '100%', height: '100%' }}></div>
        )}
      </Card>
    </>
  );
};

export default WordCloudCard;
