import React, { useRef, useState, useMemo, useEffect, MouseEvent } from 'react';
import { useTransition } from '@react-spring/web';
import { Main, Container, Message, Button, Content, Life } from './styles';
import { Alert, Slide, Collapse, AlertTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
let id = 0;

interface MessageHubProps {
  config?: {
    tension: number;
    friction: number;
    precision: number;
  };
  timeout?: number;
  children: (add: AddFunction) => void;
}

type AddFunction = (
  message: string,
  severity: string,
  alertTitle: string,
) => void;

interface Item {
  key: number;
  message: string;
  severity: string;
  alertTitle: string;
}

const MessageHub = ({
  config = { tension: 125, friction: 20, precision: 0.1 },
  timeout = 3000,
  children,
}: MessageHubProps) => {
  const refMap = useMemo(() => new WeakMap(), []);
  const cancelMap = useMemo(() => new WeakMap(), []);
  const [items, setItems] = useState<Item[]>([]);

  const transitions = useTransition(items, {
    from: { opacity: 0, height: 0, life: '100%' },
    keys: (item) => item.key,
    enter: (item) => async (next, cancel) => {
      cancelMap.set(item, cancel);
      await next({ opacity: 1, height: refMap.get(item)?.offsetHeight });
      await next({ life: '0%' });
    },
    leave: [{ opacity: 0 }, { height: 0 }],
    onRest: (result, ctrl, item) => {
      setItems((state) =>
        state.filter((i) => {
          return i.key !== item.key;
        }),
      );
    },
    config: (item, index, phase) => (key) =>
      phase === 'enter' && key === 'life' ? { duration: timeout } : config,
  });

  useEffect(() => {
    children((message: string, severity: string, alertTitle: string) => {
      setItems((state) => [
        ...state,
        { key: id++, message, severity, alertTitle },
      ]);
    });
  }, []);

  return (
    <>
      <Container>
        {transitions(({ life, ...style }, item) => (
          <Message style={style}>
            <Alert
              variant="filled"
              severity={item.severity}
              ref={(ref: HTMLDivElement) => ref && refMap.set(item, ref)}
            >
              <AlertTitle>{item.alertTitle}</AlertTitle>
              {item.message}
              <Life
                style={{
                  right: life,
                  background:
                    'linear-gradient(130deg, ' +
                    (item.severity === 'info'
                      ? ' #8dfeff, #00b4e6'
                      : item.severity === 'success'
                      ? '#c4ff5c, #2da71b'
                      : item.severity === 'error'
                      ? '#ffdde1, #e8001b'
                      : '#fcde4a, #ff4e50') +
                    ')',
                }}
              />
              <IconButton
                onClick={(e: MouseEvent) => {
                  e.stopPropagation();
                  if (cancelMap.has(item) && life.get() !== '0%')
                    cancelMap.get(item)();
                }}
                sx={{
                  position: 'absolute',
                  top: '0px',
                  right: '0px',
                  pointerEvents: 'all',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                <CloseIcon></CloseIcon>
              </IconButton>
            </Alert>
          </Message>
        ))}
      </Container>
    </>
  );
};

const SpringFlashAlert = ({
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
  const ref = useRef<null | AddFunction>(null);
  React.useEffect(() => {
    if (createdAt === '0') {
      return; // 初回実行防止
    }
    ref.current?.(message, severity, alertTitle);
  }, [createdAt]);

  return (
    <MessageHub
      children={(add: AddFunction) => {
        ref.current = add;
      }}
    />
  );
};

export default SpringFlashAlert;
