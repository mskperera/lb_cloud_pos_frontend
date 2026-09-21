// src/utils/tauri/appConfig.js
import { readTextFile, writeTextFile, exists, BaseDirectory } from '@tauri-apps/plugin-fs';

let cachedConfig = null;

export const loadAppConfig = async () => {
  if (cachedConfig) return cachedConfig;

  const isTauriApp = ('isTauri' in window && !!window.isTauri) || !!window.__TAURI__;

  if (isTauriApp) {
    try {
      // 1. AppData/Roaming/<YourAppName>/config.json file එක තියෙනවද බලනවා
      const hasConfig = await exists('config.json', { 
        baseDir: BaseDirectory.AppConfig,
        dir: BaseDirectory.AppConfig 
      });

      if (hasConfig) {
        // තිබේ නම් read කරයි
        const fileData = await readTextFile('config.json', { 
          baseDir: BaseDirectory.AppConfig,
          dir: BaseDirectory.AppConfig 
        });
        cachedConfig = JSON.parse(fileData);
        //console.log("Loaded dynamic config from AppData:", cachedConfig);
        return cachedConfig;
      } else {
        // 2. නැත්නම් public/config.json එකෙන් load කර AppData එකේ auto WRITE කරයි
       // console.log("AppData config not found. Creating default config.json...");
        const res = await fetch('/config.json');
        const defaultConfig = await res.json();

        // AppData Folder එකට File එක auto write කිරීම
        await writeTextFile('config.json', JSON.stringify(defaultConfig, null, 2), {
          baseDir: BaseDirectory.AppConfig,
          dir: BaseDirectory.AppConfig
        });

        cachedConfig = defaultConfig;
        console.log("Successfully created config.json in AppData:", cachedConfig);
        return cachedConfig;
      }
    } catch (err) {
      console.error("Error reading/writing AppData dynamic config:", err);
    }
  }

  // Fallback: Web browser run වෙද්දී හෝ error එකක් ආවොත්
  try {
    const res = await fetch('/config.json');
    cachedConfig = await res.json();
    console.log("Fallback loaded from public/config.json:", cachedConfig);
    return cachedConfig;
  } catch (e) {
    return {
      REACT_APP_API_PATH: process.env.REACT_APP_API_PATH,
      REACT_APP_API_PATH_MAIN: process.env.REACT_APP_API_PATH_MAIN,
      REACT_APP_API_CDN: process.env.REACT_APP_API_CDN,
    };
  }
};
