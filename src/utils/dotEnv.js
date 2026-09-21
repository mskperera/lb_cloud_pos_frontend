import { loadAppConfig } from "./tauri/appConfig";

let cachedConfig = null;

export const getAppConnection = async () => {
  if (cachedConfig) {
    return cachedConfig;
  }

  const isTauriApp = ('isTauri' in window && !!window.isTauri) || !!window.__TAURI__;

  if (isTauriApp) {
    try {
      const dynamicConfig = await loadAppConfig();
      if (dynamicConfig) {
        console.log("Dynamic config loaded phenomenon from Tauri:", dynamicConfig);
        cachedConfig = dynamicConfig; // Memory එකේ cache කරගනී
        return cachedConfig;
      }
    } catch (error) {
      console.error("Error loading dynamic config in getAppConnection:", error);
    }
  }

  cachedConfig = process.env;
  return cachedConfig;
};


export const getAppConfigValue = async (key) => {
  const config = await getAppConnection();
  return config ? config[key] : undefined;
};


export const getAppConfigValueSync = (key) => {

  if (cachedConfig && cachedConfig[key] !== undefined) {
    return cachedConfig[key];
  }

  if (window.APP_CONFIG && window.APP_CONFIG[key] !== undefined) {
    return window.APP_CONFIG[key];
  }

  return process.env[key];
};