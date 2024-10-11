const { app, BrowserWindow, ipcMain } = require("electron");

const path = require("path");
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
      devTools: true, // While developing, erase in production
    },
    icon: path.join(__dirname, "./src/assets/img/logo-alt.png"),
  });

  // Load Angular index
  mainWindow.loadURL(
    path.join(__dirname, "/dist/agricore-interface/index.html")
  );
  mainWindow.on("closed", () => null);
  // To reload for dev purposes, erase in production
  mainWindow.webContents.on("did-fail-load", () =>
    mainWindow.loadURL(
      path.join(__dirname, "/dist/agricore-interface/index.html")
    )
  );
  mainWindow.maximize;
}

// Window controls //
ipcMain.on("window:minimize", () => mainWindow.minimize());

ipcMain.on("window:maximize", () => {
  mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
});

ipcMain.on("window:restore", () => mainWindow.restore());

ipcMain.on("window:close", () => mainWindow.close());

ipcMain.on("window:goBack", () => mainWindow.webContents.goBack());

ipcMain.on("window:goForward", () => mainWindow.webContents.goForward());

ipcMain.on("window:minSize", (event, args) => {
  const [width, height] = args;
  mainWindow.setMinimumSize(width, height);
});

ipcMain.on("window:resize", (event, args) => {
  const [width, height, resize] = args;
  mainWindow.unmaximize();
  mainWindow.setSize(width, height);
  mainWindow.setResizable(resize);
});

app.on("window-all-closed", function () {
  if (process.platform == "darwin") app.quit(); // Mac OS
  if (process.platform == "win32") app.quit(); // Windows
  if (process.platform == "linux") app.quit(); // Linux
});
// *** //

app.whenReady().then(() => createWindow());
