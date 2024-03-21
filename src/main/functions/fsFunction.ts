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
import store from './electronStore';
import * as path from 'path';
import buildTokenizer from './myTokenizer';
import cleaningToken from './cleaning';
import {
  tfidfArray,
  tfidfToken,
  document,
  WordDocMap,
} from '../../common/types';

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
  try {
    const pdfs = await readFolderPDF(dirPath);
    let tokensTF = [];
    let allDocumentsTFIDF: tfidfArray = [];
    let allDocumentsTF = [];
    let documents: document[] = [];
    let wordDocMap: WordDocMap = new Map();
    let idfMap: Map<string, number> = new Map();
    const memoTemp = store.get('memoTemplate', '');
    const tokenizer = await buildTokenizer();
    const stopWord = tokenizer
      .tokenize(memoTemp)
      .filter((t) => t.pos === '名詞')
      .map((t) => (t.basic_form === '*' ? t.surface_form : t.basic_form));
    for (let i = 0; i < pdfs.length; i++) {
      let fileName = pdfs[i];
      let fl = fileName.length;
      let filePath = dirPath + '\\Memo\\' + fileName.slice(0, fl - 4) + '.txt';
      let txt = await readTxtFile(filePath);
      let tokens = tokenizer.tokenize(txt);
      // TFの計算
      tokensTF = tokens
        .filter((t) => t.pos === '名詞')
        .map((t) => (t.basic_form === '*' ? t.surface_form : t.basic_form))
        .reduce((data: { text: string; tf: number }[], text: string) => {
          if (stopWord.includes(text)) {
            return data;
          }
          if (cleaningToken(text)) {
            return data;
          }
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
      let tempTokens: tfidfToken[] = [];
      for (let j = 0; j < nowDoc.length; j++) {
        let t = nowDoc[j];
        let tempWord: tfidfToken = {
          name: 'word',
          value: 0,
        };
        tempWord.name = t.text;
        tempWord.value = t.tf * idfMap.get(t.text)!;
        tempTokens.push(tempWord);
      }
      allDocumentsTFIDF.push(tempTokens);
    }
    // 返すDocumentの再構成
    for (let i = 0; i < pdfs.length; i++) {
      let tempDoc: document = {
        id: -1,
        fileName: '',
        filePath: '',
        tokens: [],
        fileContent: '',
        wordNumber: 0,
      };
      tempDoc.id = i;
      tempDoc.fileName = pdfs[i];
      tempDoc.filePath =
        dirPath + '\\Memo\\' + pdfs[i].slice(0, pdfs[i].length - 4) + '.txt';
      tempDoc.tokens = allDocumentsTFIDF[i];
      await readTxtFile(tempDoc.filePath).then((txt: string) => {
        tempDoc.fileContent = txt;
        tempDoc.wordNumber = tokenizer.tokenize(txt).length;
      });
      documents.push(tempDoc);
    }
    return documents;
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
