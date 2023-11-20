import { ipcMain, dialog, BrowserWindow } from 'electron';

const fileDialogFunctionListener = async (mainWindow: BrowserWindow) => {
  await ipcMain.handle('open-by-button', async () => {
    return dialog
      .showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
        title: '作業ディレクトリを選択',
      })
      .then((result) => {
        if (result.canceled) return;
        return String(result.filePaths[0]);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  });
};

export default fileDialogFunctionListener;
