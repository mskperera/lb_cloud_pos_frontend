// src/functions/tauri/tauriHttp.js
import { fetch } from '@tauri-apps/plugin-http';

export const tauriPost = async (url, data) => {
  try {

    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
    return JSON.parse(res.data);
  } catch (err) {
    return err;
  }
};

export const tauriGet = async (url) => {
  try {
    const res = await fetch(url, { method: 'GET' });
    return JSON.parse(res.data);
  } catch (err) {
    return err;
  }
};
