import { ipcMain } from 'electron';
import { MemoContent } from '../../common/types';

const Store = require('electron-store');
const store = new Store({
  encryptionKey: 'myencryptionkeycode', //簡易的に暗号化(AES256CBC形式)
});

const wd: string = 'workDirectorys';

const setDirsList = async (list: string[]) => {
  try {
    await store.set(wd, list);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const setStoreSetList = async () => {
  await ipcMain.handle('store-setlist', async (event, list: string[]) => {
    try {
      return setDirsList(list);
    } catch (err) {
      console.log('error in store-get-string', err);
      return false;
    }
  });
};

const setStoreGetList = async () => {
  await ipcMain.handle('store-getlist', async (event, key: string) => {
    try {
      return store.get(wd, []);
    } catch (err) {
      console.log('error in store-getlist', err);
      return null;
    }
  });
};

const getWindowSize = async () => {
  await ipcMain.handle('get-window-size', async (event) => {
    try {
      return store.get('window.size') || [1024, 728];
    } catch (err) {
      return;
    }
  });
};

const setSelectedIndex = async () => {
  await ipcMain.handle('set-selected-index', async (event, index: number) => {
    try {
      store.set('selectedDirectory', index);
      console.log('setSelected', index);
    } catch (err) {
      return;
    }
  });
};

const getSelectedIndex = async () => {
  await ipcMain.handle('get-selected-index', async (event) => {
    try {
      return store.get('selectedDirectory', 0);
    } catch (err) {
      return;
    }
  });
};

const getMemoTemplate = async () => {
  await ipcMain.handle('get-memo-template', async (event) => {
    try {
      return store.get('memoTemplate', '');
    } catch (err) {
      return;
    }
  });
};

const setMemoTemplate = async () => {
  await ipcMain.handle(
    'set-memo-template',
    async (event, memoTemplate: string) => {
      try {
        return store.set('memoTemplate', memoTemplate);
      } catch (err) {
        return;
      }
    },
  );
};

export const electronStoreListener = async () => {
  await setStoreGetList();
  await setStoreSetList();
  await getWindowSize();
  await setSelectedIndex();
  await getSelectedIndex();
  await setMemoTemplate();
  await getMemoTemplate();
};

export default store;
