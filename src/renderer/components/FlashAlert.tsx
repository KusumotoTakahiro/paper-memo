import * as React from 'react';

import { Alert, Slide, Collapse, AlertTitle } from '@mui/material';
import { TransitionGroup } from 'react-transition-group';

const FlashAlert = ({
  severity,
  message,
  createdAt,
  alertTitle,
}: {
  severity: string;
  message: string;
  createdAt: string;
  alertTitle: string;
}) => {
  const [showAlert, setShowAlert] = React.useState(false);

  React.useEffect(() => {
    // 初回実行防止
    if (createdAt === '0') {
      return;
    }
    let isMounted = true;
    setShowAlert(true);
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        setShowAlert(false);
        console.log(
          'endflashAlert' + String(Number(Date.now()) - Number(createdAt)),
        );
      }
    }, 3000);
    console.log('flashAlert');
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [createdAt]);

  const alertStyle = (): React.CSSProperties => {
    return {
      position: 'fixed',
      bottom: 30,
      left: 30,
      zIndex: 999,
      margin: '0px',
      width: '30%',
    };
  };

  const NowAlert = () => (
    <Alert severity={severity} style={alertStyle()}>
      <AlertTitle>{alertTitle}</AlertTitle>
      {message}
    </Alert>
  );

  return <>{showAlert ? <NowAlert /> : <></>}</>;
};

export default FlashAlert;
