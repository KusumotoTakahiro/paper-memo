import * as kuromoji from 'kuromoji';
import * as path from 'path';
import { app } from 'electron';

const buildTokenizer = () => {
  // 開発環境では __dirname を使用し、本番環境では process.resourcesPath を使用
  const basePath = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : 'assets/';

  const dicPath = path.join(basePath, 'dict');

  return new Promise<kuromoji.Tokenizer<kuromoji.IpadicFeatures>>(
    (resolve, reject) => {
      kuromoji.builder({ dicPath: dicPath }).build((err, tokenizer) => {
        if (err) {
          reject(err);
        } else {
          resolve(tokenizer);
        }
      });
    },
  );
};

export default buildTokenizer;
