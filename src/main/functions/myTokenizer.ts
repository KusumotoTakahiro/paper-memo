import * as kuromoji from 'kuromoji';

const buildTokenizer = () => {
  return new Promise<kuromoji.Tokenizer<kuromoji.IpadicFeatures>>(
    (resolve, reject) => {
      kuromoji
        .builder({ dicPath: 'node_modules/kuromoji/dict' })
        .build((err, tokenizer) => {
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
