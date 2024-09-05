const {ConnectDatabase,DisconnectDatabase} = require('./Data/app.js');

// Modules to control application life and create native browser window
const { app, BrowserWindow,ipcMain, webContents } = require('electron')
let Db;

let GlobalWin;

ipcMain.on("GET",(event,Query) => {
  console.warn('Query is being executed');
  
  Db.serialize(() => {
    Db.all(Query, [], (err, rows) => {
      if (err) {
        console.error('Error executing SELECT query:', err.message);
        return;
      }
      //Sending respond
      GlobalWin.webContents.send('GET-RESPOND',rows);
    });
  });
})

ipcMain.on("UPDATE", (e,Query) => {
  console.warn('Insert query is being executed');
  Db.run(Query);
})


function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  })
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

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

