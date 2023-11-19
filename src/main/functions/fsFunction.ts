import { ipcMain } from 'electron';
import { readdirSync } from 'fs';
import * as path from 'path';

/**
 * フォルダを読み込んで中のPDFを返す関数
 * @param dirPath 一覧取得したいディレクトリのパス
 * @return PDFの一覧
 */
const readFolderPDF = async (dirPath: string) => {
  console.log('excute readFolderPDF event on main.ts');
  try {
    const files = readdirSync(dirPath, { withFileTypes: true });
    const pdfFiles = files
      .filter((dirent) => dirent.isFile())
      .filter((dirent) => path.extname(dirent.name).toLowerCase() === '.pdf')
      .map((dirent) => dirent.name);
    return pdfFiles;
  } catch (err) {
    console.error('Error while getting PDF files:', err);
    return [];
  }
};

const fsFunctionListener = async () => {
  await ipcMain.handle('read-file', async (event, [dirPath]: string[]) => {
    try {
      return readFolderPDF(dirPath);
    } catch (err) {
      console.log('error in read-file handler:', err);
      return [];
    }
  });
};

export default fsFunctionListener;
