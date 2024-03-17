import { ipcMain } from 'electron';
import {
  readdirSync,
  writeFileSync,
  readFileSync,
  stat,
  existsSync,
  mkdirSync,
  statSync,
  copyFileSync,
} from 'fs';
import * as path from 'path';
import buildTokenizer from './myTokenizer';

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
 * フォルダー内のテキストファイルで個別にtfidf値を求めて返す関数
 * @param dirPath
 * @returns　allDocumentsTFIDF:{ text: string; tfidf: number }[][]
 */
const readTxtFiles = async (dirPath: string) => {
  type WordDocMap = Map<string, Set<number>>;
  type tfidfArray = { text: string; tfidf: number }[][];
  try {
    const pdfs = await readFolderPDF(dirPath);
    let fileName = '';
    let fl = 0;
    let filePath;
    let txt = '';
    let tokens = [];
    let tokensTF = [];
    let allDocumentsTFIDF: tfidfArray = [[]];
    let allDocumentsTF = [];
    let wordDocMap: WordDocMap = new Map();
    let idfMap: Map<string, number> = new Map();
    const tokenizer = await buildTokenizer();
    for (let i = 0; i < pdfs.length; i++) {
      fileName = pdfs[i];
      fl = fileName.length;
      filePath = dirPath + '\\Memo\\' + fileName.slice(0, fl - 4) + '.txt';
      txt = await readTxtFile(filePath);
      // ここで，TF-IDFの計算で不要な単語の除去すべき
      tokens = tokenizer.tokenize(txt);
      // TFの計算
      tokensTF = tokens
        .filter((t) => t.pos === '名詞')
        .map((t) => (t.basic_form === '*' ? t.surface_form : t.basic_form))
        .reduce((data: { text: string; tf: number }[], text: string) => {
          const target = data.find((c) => c.text === text);
          if (target) {
            target.tf = target.tf + 1;
          } else {
            data.push({
              text,
              tf: 1,
            });
          }
          return data;
        }, []);
      allDocumentsTF.push(tokensTF);
    }
    // IDFの計算
    for (let i = 0; i < allDocumentsTF.length; i++) {
      const nowDoc = allDocumentsTF[i];
      for (let j = 0; j < nowDoc.length; j++) {
        const word = nowDoc[j].text;
        if (!wordDocMap.has(word)) {
          wordDocMap.set(word, new Set());
        }
        wordDocMap.get(word)!.add(i);
      }
    }
    wordDocMap.forEach((docIndexes, word) => {
      const df = docIndexes.size;
      const idf = Math.log(allDocumentsTF.length / df) + 1;
      idfMap.set(word, idf);
    });
    // TF-IDFの計算
    for (let i = 0; i < allDocumentsTF.length; i++) {
      const nowDoc = allDocumentsTF[i];
      let tempDoc: { text: string; tfidf: number }[] = [];
      for (let j = 0; j < nowDoc.length; j++) {
        let t = nowDoc[j];
        let tempWord: { text: string; tfidf: number } = {
          text: 'word',
          tfidf: 0,
        };
        tempWord.text = t.text;
        tempWord.tfidf = t.tf * idfMap.get(t.text)!;
        tempDoc.push(tempWord);
      }
      allDocumentsTFIDF.push(tempDoc);
    }
    return allDocumentsTFIDF;
  } catch (err) {
    console.log(err);
    return [];
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

const copyFile = async (srcPath: string, savePath: string) => {
  try {
    await copyFileSync(srcPath, savePath);
  } catch (err) {}
};

/**---------------------- ここからset関数群 -----------------------------*/

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

const setReadTxtFile = async () => {
  await ipcMain.handle('read-file', async (event, [filePath]: string) => {
    try {
      return await readTxtFile(filePath);
    } catch (err) {
      return;
    }
  });
};

const setReadTxtFiles = async () => {
  await ipcMain.handle('read-all-file', async (event, [dirPath]: string) => {
    try {
      return await readTxtFiles(dirPath);
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

const setCopy = async () => {
  await ipcMain.handle(
    'copy-file',
    async (event, srcPath: string, savePath: string) => {
      try {
        return copyFile(srcPath, savePath);
      } catch (err) {}
    },
  );
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
  await setCopy();
  await setReadTxtFiles();
};

export default fsFunctionListener;
