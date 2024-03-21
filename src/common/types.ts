export interface PDFMetaData {
  fileName: string;
  pages: number;
  fileSize: string;
}

export interface MemoContent {
  contentBody: string;
}

export type WordDocMap = Map<string, Set<number>>;
export type tfidfToken = { name: string; value: number }; //echartに合わせてる
export type document = {
  id: number;
  tokens: tfidfToken[];
  fileName: string;
  filePath: string;
  wordNumber: number;
  fileContent: string;
};
export type tfidfArray = tfidfToken[][];
