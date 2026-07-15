import { BrowserWindow, app } from "electron";
import path from "path";
import { fileURLToPath } from "url";
//#region electron/main.js
var __dirname = path.dirname(fileURLToPath(import.meta.url));
function createWindow() {
	const win = new BrowserWindow({
		width: 1e3,
		height: 700,
		webPreferences: { preload: path.join(__dirname, "preload.js") }
	});
	if (process.env.VITE_DEV_SERVER_URL) win.loadURL(process.env.VITE_DEV_SERVER_URL);
	else win.loadFile(path.join(__dirname, "../dist/index.html"));
}
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
//#endregion
export {};
