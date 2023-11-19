import { ipcMain } from 'electron';
import { PDFMetaData } from '../../common/types';

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const Encoding = require('encoding-japanese');
const regex = /(\d+)\s*bytes/; // 数字 + 任意の空白 + "bytes"

/**
 * s-jisをUnicodeに変換する関数
 * @param bytes s-jisの文字列
 * @returns
 */
const SJIStoUNICODE = (bytes: string) => {
  return Encoding.convert(bytes, {
    from: 'SJIS',
    to: 'UNICODE',
    type: 'string',
  });
};

const getMetaData = (pdfMetaData: string) => {
  // 文字列を行ごとに分割して、各行を処理
  const metaDataLines: string[] = pdfMetaData.split('\n');
  const metaDataObject: PDFMetaData = { fileName: '', pages: 0, fileSize: '' };

  //  "File size" と "Page size" を取り出す
  for (const line of metaDataLines) {
    const [key, value] = line.split(':');
    if (key === 'Pages') {
      metaDataObject.pages = Number(value);
    } else if (key === 'File size') {
      let match = value.match(regex);
      if (match) {
        metaDataObject.fileSize = String(`${match[1]}bytes`);
      }
    }
    console.log(key + ' : ' + value);
  }
  console.log(metaDataObject);
  return metaDataObject;
};

const cliFunctionListener = async () => {
  await ipcMain.handle(
    'get-pdf-info',
    async (event, filePath: string, fileName: string) => {
      try {
        const { stdout, stderr } = await exec(
          `cd ${filePath} && pdfinfo ${fileName}`,
          {
            encoding: 'Shift_JIS',
          },
        );
        return getMetaData(SJIStoUNICODE(stdout));
      } catch (err) {
        console.log(
          'error in get-pdf-info handler',
          SJIStoUNICODE(String(err)),
        );
        return [];
      }
    },
  );
};

export default cliFunctionListener;
