import { ipcMain } from 'electron';

const Store = require('electron-store');
const store = new Store({
  encryptionKey: 'myencryptionkeycode', //簡易的に暗号化(AES256CBC形式)
});

const wd: string = 'workDirectorys';

const setData = async (list: string[]) => {
  try {
    await store.set(wd, list);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const electronStoreListener = async () => {
  await ipcMain.handle('store-getlist', async (event, key: string) => {
    try {
      return store.get(wd, []);
    } catch (err) {
      console.log('error in store-getlist', err);
      return null;
    }
  });
  await ipcMain.handle('store-setlist', async (event, list: string[]) => {
    try {
      return setData(list);
    } catch (err) {
      console.log('error in store-get-string', err);
      return false;
    }
  });
};

export default store;
