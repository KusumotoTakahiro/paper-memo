// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { MemoContent } from '../common/types';

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
      const PDFdata = await ipcRenderer.invoke('read-dir', [dirPath]);
      return PDFdata;
    },
    writeTxtFile: async (filePath: string, data: string) => {
      await ipcRenderer.invoke('write-file', ...[filePath, data]);
    },
    readTxtFile: async (filePath: string) => {
      const data: string = await ipcRenderer.invoke('read-file', [filePath]);
      return data;
    },
    readTxtFiles: async (dirPath: string) => {
      const data: { name: string; value: number }[][] =
        await ipcRenderer.invoke('read-all-file', [dirPath]);
      return data;
    },
    isDir: async (filePath: string) => {
      const isDirectory = await ipcRenderer.invoke('is-dir', [filePath]);
      return isDirectory;
    },
    makeDir: async (dirPath: string) => {
      const exsitDirectory = await ipcRenderer.invoke('make-dir', [dirPath]);
      return exsitDirectory;
    },
    existTxtFile: async (filePath: string) => {
      const isExist: boolean = await ipcRenderer.invoke('exist', [filePath]);
      return isExist;
    },
    copyFile: async (srcPath: string, savePath: string) => {
      await ipcRenderer.invoke('copy-file', ...[srcPath, savePath]);
    },
  },
  PDFmetaData: {
    //これもCliFunctionsの一部だけど，移行するとめんどうなので放置.
    getInfo: async (filePath: string, fileName: string) => {
      const PDFMetaData = await ipcRenderer.invoke(
        'get-pdf-info',
        ...[filePath, fileName],
      );
      return PDFMetaData;
    },
  },
  cliFunctions: {
    openByBrowser: async (filePath: string) => {
      await ipcRenderer.invoke('open-by-browser', [filePath]);
    },
    delFile: async (filePath: string) => {
      const isDeleted: boolean = await ipcRenderer.invoke('del-file', [
        filePath,
      ]);
      return isDeleted;
    },
  },
  fileDialog: {
    open: async () => {
      const filePath: string = await ipcRenderer.invoke('open-by-button');
      return String(filePath);
    },
  },
  electronStore: {
    getlist: async () => {
      const value: string[] = await ipcRenderer.invoke('store-getlist');
      return value;
    },
    setlist: async (value: string[]) => {
      const isSet: boolean = await ipcRenderer.invoke('store-setlist', value);
      return isSet;
    },
    getWindowSize: async () => {
      const winSize = await ipcRenderer.invoke('get-window-size');
      return winSize;
    },
    getSelectedIndex: async () => {
      const index: number = await ipcRenderer.invoke('get-selected-index');
      return index;
    },
    setSelectedIndex: async (index: number) => {
      await ipcRenderer.invoke('set-selected-index', index);
    },
    getMemoTemplate: async () => {
      const memoTemplate: string =
        await ipcRenderer.invoke('get-memo-template');
      return memoTemplate;
    },
    setMmoTemplate: async (memoTemplate: string) => {
      await ipcRenderer.invoke('set-memo-template', memoTemplate);
    },
  },
  makeMD: {
    makeMD: async (memo: string) => {
      const memoMD: any = await ipcRenderer.invoke('make-md', memo);
      return memoMD;
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
