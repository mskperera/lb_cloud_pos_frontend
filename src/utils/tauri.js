export function isTauriApp() {
  if (typeof window !== "undefined" && "__TAURI__" in window) {
    console.log("Running in Tauri desktop/mobile app");
    return true;
  } else {
    console.log("Running in browser");
    return false;
  }
}