const {ConnectDatabase,DisconnectDatabase} = require('./Data/app.js');

// Modules to control application life and create native browser window
const { app, BrowserWindow,ipcMain, webContents } = require('electron')
let Db;

let GlobalWin;

ipcMain.handle('GET', async (event, sqlQuery) => {
  return new Promise(res => {
      Db.all(sqlQuery, (err, rows) => {
        res(rows);
      });
  });
});

ipcMain.on("UPDATE", (e,Query) => {
  Db.run(Query);
})

ipcMain.on("TITLE-BAR",(e,Option) =>{
  switch(Option){
    case 'Close':
      app.quit();
      break;
    case 'Minimize':
      GlobalWin.minimize();
      break;
    case 'Max':
      if(GlobalWin.isMaximized())
      {
        GlobalWin.unmaximize();
      }
      else
      {
        GlobalWin.maximize();
      }
      break;
  }
});


function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  })
  // and load the index.html of the app.
  mainWindow.loadFile('./Forms/Index/index.html');

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  GlobalWin = mainWindow;
}

//App ready to start
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  Db = ConnectDatabase();
})


app.on('window-all-closed', function () {
  DisconnectDatabase(Db);
  if (process.platform !== 'darwin') app.quit()
})
