import { ipcMain } from 'electron';
import { marked } from 'marked';

const makeMarkDown = async (memo: string) => {
  try {
    const markdown = await marked(memo);
    return String(markdown);
  } catch (err) {
    return '';
  }
};

const setMakeMarkDown = async () => {
  await ipcMain.handle('make-md', async (event, memo: string) => {
    try {
      return await makeMarkDown(memo);
    } catch (err) {
      return '';
    }
  });
};

const makedListner = async () => {
  await setMakeMarkDown();
};

export default makedListner;
