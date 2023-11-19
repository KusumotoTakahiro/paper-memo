import * as React from 'react';

const Setting = () => {
  const text = document.getElementById('text');
  const button = document.getElementById('button');

  button?.addEventListener('click', async () => {
    const filepath = await window.myAPI.openByButton();

    if (filepath) {
      if (text) text.textContent = filepath;
    } else {
      if (text) text.textContent = '';
    }
  });
  return <>Setting</>;
};

export default Setting;
