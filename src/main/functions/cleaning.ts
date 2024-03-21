/**
 * 正規表現で引っかかればtrueを返す．問題なければfalseを返す
 * @param token
 * @returns
 */
const patternTest = (token: string) => {
  // ヘッダー: 1つ以上の '#' で始まり、その後に空白が1つ以上ある
  const patHeader = /^#+/;
  // 水平線: 3つ以上の '-' または '*'
  const patHorizontalLine = /^([-ー]+|\*\*\*+)$/;
  // テーブルの区切り行: '|', ':', '-', が一定のパターンで並ぶ
  const patTableDivider = /\|?(:?-+:?\|?)+/;

  const isHeader = patHeader.test(token);
  const isHorizontalLine = patHorizontalLine.test(token);
  const isTableDivider = patTableDivider.test(token);

  return isHeader || isTableDivider || isHorizontalLine;
};

/**
 * マークダウンで使う記号のみの場合はtrue, それ以外はfalseで返す.
 * @param token
 * @returns
 */
const kigoTest = (token: string) => {
  const stopKigo = [
    '<',
    '＜',
    '>',
    '＞',
    '/>',
    '/＞',
    '[',
    '「',
    ']',
    '」',
    '(',
    ')',
    '>>',
    'ー',
    '-',
    '*',
    '**',
    '|',
    '~',
    '～',
    '**</',
    '>**',
    '"',
    '">**',
    '/',
    '・',
    '.',
    '=',
    '＝',
    '+',
    '＋',
  ];
  return stopKigo.includes(token);
};

const notAllowTagTest = (token: string) => {
  const ALLOWED_TAGS = [
    'p',
    'br',
    'ul',
    'ol',
    'li',
    'blockquote',
    'strong',
    'em',
    'a',
    'hr',
    'code',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'font',
    'table',
    'td',
    'tbody',
    'th',
    'thead',
    'tr',
    'input',
  ];
  return ALLOWED_TAGS.includes(token);
};

/**
 * 記号（取り除く対象語）であればtrue，なければfalseを返す
 * @param token
 * @returns
 */
const cleaningToken = (token: string) => {
  return patternTest(token) || kigoTest(token) || notAllowTagTest(token);
};

export default cleaningToken;
