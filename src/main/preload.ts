// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

/**
 * ここでレンダラープロセスとメインプロセスの通信を定義する
 * ex)
 * test: {
 *  通信名: (引数: 引数の型) => {
 *    ipcRenderer.メソッド();
 *    return OOOO;
 *  }
 * }
 */
const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  fs: {
    readFolderPDF: async (dirPath: string) => {
      const PDFdata = await ipcRenderer.invoke('read-file', [dirPath]);
      return PDFdata;
    },
  },
  PDFmetaData: {
    getInfo: async (filePath: string, fileName: string) => {
      const PDFMetaData = await ipcRenderer.invoke(
        'get-pdf-info',
        ...[filePath, fileName],
      );
      return PDFMetaData;
    },
  },
  fileDialog: {
    open: async () => {
      const filePath: string = await ipcRenderer.invoke('open-by-button');
      return String(filePath);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
