import { ipcMain } from 'electron';
import {
  readdirSync,
  writeFileSync,
  readFileSync,
  stat,
  existsSync,
  mkdirSync,
  statSync,
} from 'fs';
import * as path from 'path';

/**
 * フォルダを読み込んで中のPDFを返す関数
 * @param dirPath 一覧取得したいディレクトリのパス
 * @return PDFの一覧
 */
const readFolderPDF = async (dirPath: string) => {
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

/**
 * パスのtxtファイルに新しい内容を上書きする関数．
 * @param filePath txtファイルまでのパス
 * @param data txtファイルに書き込む内容
 * @returns
 */
const writeTxtFile = async (filePath: string, data: string) => {
  try {
    await writeFileSync(filePath, data);
  } catch (err) {
    return;
  }
};

/**
 * txtファイルの中身を読み込んでそのまま返す関数．
 * @param filePath txtファイルまでのパス
 * @returns
 */
const readTxtFile = async (filePath: string) => {
  try {
    const txtFile = readFileSync(filePath, { encoding: 'utf8' });
    return txtFile;
  } catch (err) {
    return '';
  }
};

/**
 * txtファイルが存在すれば，trueを返す.無ければfalseを返す
 * @param filePath txtファイルまでのパス
 * @returns
 */
const existsTxtFile = async (filePath: string) => {
  try {
    const stats = statSync(filePath);
    const fileExists = stats.isFile();
    console.log('File exists:', fileExists);
    return fileExists;
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      console.log('File does not exist:', filePath);
      return false;
    } else {
      console.error('Error checking file existence:', err);
    }
  }
};

/**
 * 指定したパスがDirectoryであるかを判定する関数．
 * @param dirPath Directoryまでのパス
 * @returns DirectoryであればTrue，違えばFalse
 */
const isDir = async (dirPath: string) => {
  let isDirectory = false;
  try {
    await stat(dirPath, (err, stats) => {
      if (stats.isDirectory()) {
        isDirectory = true;
      }
    });
  } catch (err) {
    console.log(err);
  }
  return isDirectory;
};

/**
 * 指定されたパスの直下にMemoディレクトリを作成する
 * @param dirPath Memoディレクトリを作成する階層のパスを指定
 * @returns 作成出来たらtrue，既にあればfalse
 */
const makeDir = async (dirPath: string) => {
  let existDirectory: boolean = false;
  try {
    existDirectory = await existsSync(dirPath + '\\Memo');
    if (!existDirectory) {
      await mkdirSync(dirPath + '\\Memo');
    }
  } catch (err) {
    console.log(err);
  }
  return existDirectory;
};

/**
 * 文字列read-dirをreadFolderPDF()のトリガーとして登録しておく関数.
 */
const setReadFolderPDF = async () => {
  await ipcMain.handle('read-dir', async (event, [dirPath]: string) => {
    try {
      return readFolderPDF(dirPath);
    } catch (err) {
      console.log('error in read-dir handler:', err);
      return [];
    }
  });
};

/**
 * 文字列write-fileをwriteTxtFile()のトリガーとして登録しておく関数.
 */
const setWriteTxtFile = async () => {
  await ipcMain.handle(
    'write-file',
    async (event, filePath: string, data: string) => {
      try {
        await writeTxtFile(filePath, data);
      } catch (err) {
        return;
      }
    },
  );
};

/**
 * 文字列read-fileをreadTxtFile()のトリガーとして登録しておく関数
 */
const setReadTxtFile = async () => {
  await ipcMain.handle('read-file', async (event, [filePath]: string) => {
    try {
      return await readTxtFile(filePath);
    } catch (err) {
      return;
    }
  });
};

const setIsDir = async () => {
  await ipcMain.handle('is-dir', async (event, filePath: string) => {
    try {
      return await isDir(filePath);
    } catch (err) {
      return;
    }
  });
};

const setMakeDir = async () => {
  await ipcMain.handle('make-dir', async (event, dirPath: string) => {
    try {
      return await makeDir(dirPath);
    } catch (err) {
      return;
    }
  });
};

const setIsExist = async () => {
  await ipcMain.handle('exist', async (event, [dirPath]: string) => {
    try {
      return await existsTxtFile(dirPath);
    } catch (err) {
      return;
    }
  });
};

/**
 * main.tsでトリガー登録を行う関数を展開する関数．
 */
const fsFunctionListener = async () => {
  await setReadFolderPDF();
  await setWriteTxtFile();
  await setReadTxtFile();
  await setIsDir();
  await setMakeDir();
  await setIsExist();
};

export default fsFunctionListener;
