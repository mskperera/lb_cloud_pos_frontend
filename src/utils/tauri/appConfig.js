// src/utils/config.js
import { readTextFile, writeTextFile, exists, BaseDirectory } from '@tauri-apps/plugin-fs';

const defaultConfig = {
  REACT_APP_API_PATH: process.env.REACT_APP_API_PATH || "http://localhost:8000/api",
  REACT_APP_API_PATH_MAIN: process.env.REACT_APP_API_PATH_MAIN || "http://localhost:7000/api",
  REACT_APP_API_CDN: process.env.REACT_APP_API_CDN || "http://localhost:8010/api"
};

let cachedConfig = null;

export const loadAppConfig = async () => {
  if (cachedConfig) return cachedConfig;

  // If running in browser mode, fallback directly to .env / defaults
  if (!('isTauri' in window && !!window.isTauri)) {
    cachedConfig = defaultConfig;
    return cachedConfig;
  }

  try {
    const configExists = await exists('config.json', { baseDir: BaseDirectory.AppConfig });

    if (!configExists) {
      await writeTextFile('config.json', JSON.stringify(defaultConfig, null, 2), {
        baseDir: BaseDirectory.AppConfig
      });
      cachedConfig = defaultConfig;
      return defaultConfig;
    }

    const content = await readTextFile('config.json', { baseDir: BaseDirectory.AppConfig });
    cachedConfig = JSON.parse(content);
    return cachedConfig;
  } catch (err) {
    console.error('Error loading config.json:', err);
    cachedConfig = defaultConfig;
    return defaultConfig;
  }
};