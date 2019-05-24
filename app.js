const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const dialog = electron.dialog;
const ipcMain = electron.ipcMain;

const fs = require('fs-extra')
const path = require('path')

let files_src = [];
let files_search = [];
let maching_files = [];
let nonMachingFiles_src = [];
let nonMachingFiles_search = [];

let path_src, path_search, path_target;


// Behalten Sie eine globale Referenz auf das Fensterobjekt.
// Wenn Sie dies nicht tun, wird das Fenster automatisch geschlossen,
// sobald das Objekt dem JavaScript-Garbagekollektor übergeben wird.

let win;

function createWindow () {
  // Erstellen des Browser-Fensters.
  win = new BrowserWindow({
    titleBarStyle: "default",
    useContentSize: true,
    width: 360,
    height: 224,
    // minWidth: 385,
    // minHeight: 380,
    backgroundColor: "#282c34",
    fullscreenable: false,
    resizable: true,
    maximizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  win.loadFile('html/index.html');

  // win.setResizable(false);

  // Öffnen der DevTools.
  // win.webContents.openDevTools();

  // Ausgegeben, wenn das Fenster geschlossen wird.
  win.on('closed', () => {
    // Dereferenzieren des Fensterobjekts, normalerweise würden Sie Fenster
    // in einem Array speichern, falls Ihre App mehrere Fenster unterstützt.
    // Das ist der Zeitpunkt, an dem Sie das zugehörige Element löschen sollten.
    win = null;
  });
};

// Diese Methode wird aufgerufen, wenn Electron mit der
// Initialisierung fertig ist und Browserfenster erschaffen kann.
// Einige APIs können nur nach dem Auftreten dieses Events genutzt werden.
app.on('ready', createWindow);

// Verlassen, wenn alle Fenster geschlossen sind.
app.on('window-all-closed', () => {
  // Unter macOS ist es üblich, für Apps und ihre Menu Bar
  // aktiv zu bleiben, bis der Nutzer explizit mit Cmd + Q die App beendet.
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // Unter macOS ist es üblich ein neues Fenster der App zu erstellen, wenn
  // das Dock Icon angeklickt wird und keine anderen Fenster offen sind.
  if (win === null) {
    createWindow();
  }
});

app.on("browser-window-created",(e, window) => {
  window.setMenu(null);
});

// In dieser Datei können Sie den Rest des App-spezifischen
// Hauptprozess-Codes einbinden. Sie können den Code auch
// auf mehrere Dateien aufteilen und diese hier einbinden.


exports.openFolderCompare = () => {
  win.loadFile('html/folderCompare.html');
  win.setContentSize(385, 380, true);
  // win.setResizable(false);
}

exports.openMainWindow = () => {
  win.loadFile('html/index.html');
  win.setContentSize(360, 224, true);
  // win.setResizable(false);
}

exports.selectDirectory = (btn_id) => {
  return new Promise((resolve, reject) => {
    dialog.showOpenDialog(win, {
      properties: ['openDirectory']
    }, (filenames) => {
      if(filenames) {
        switch (btn_id) {
          case "path_src":
            path_src = filenames[0];
            break;
          case "path_search":
            path_search = filenames[0];
            break;
          case "path_target":
            path_target = filenames[0];
            break;
        }
        resolve(filenames[0]);
      } else {
        console.log("nope.");
        reject();
      }
    });
  });
}

exports.check = (maching, copy) => {
  files_src = [];
  files_search = [];
  maching_files = [];
  nonMachingFiles_src = [];
  nonMachingFiles_search = [];

  if(path_src && path_search && path_target){
    fs.readdirSync(path_src).forEach((file) => {
        files_src.push(file);
    });

    fs.readdirSync(path_search).forEach((file) => {
      files_search.push(file);
    });

    files_search.forEach((file) => {
      if(files_src.includes(file)) maching_files.push(file);
      else nonMachingFiles_search.push(file);
    });

    files_src.forEach((file) => {
      if(!files_search.includes(file)) nonMachingFiles_src.push(file);
    });

    fs.ensureDir(path_target).then(() => {
      if(maching && copy) { // copy maching files from source
        maching_files.forEach((file) => {
          fs.copy(path_src + "/" + file, path_target + "/" + file).catch((err) => {
            throw err;
          });
          console.log("copied: " + path_src + "/" + file + " to " + path_target + "/" + file);

        });
      } else if (!maching && copy) { // copy non maching files from source
        nonMachingFiles_src.forEach((file) => {
          fs.copy(path_src + "/" + file, path_target + "/" + file).catch((err) => {
            throw err;
          });
          console.log("copied: " + path_src + "/" + file + " to " + path_target + "/" + file);

        });
      } else if (maching && !copy) { // copy maching files from search
        maching_files.forEach((file) => {
          fs.copy(path_search + "/" + file, path_target + "/" + file).catch((err) => {
            throw err;
          });
          console.log("copied: " + path_search + "/" + file + " to " + path_target + "/" + file);

        });

      } else if (!maching && !copy) { // copy non maching files from search
        nonMachingFiles_search.forEach((file) => {
          fs.copy(path_search + "/" + file, path_target + "/" + file).catch((err) => {
            throw err;
          });
          console.log("copied: " + path_search + "/" + file + " to " + path_target + "/" + file);

        });
      }

    }).catch((err) => {
      throw err;
    });
  } else {
    console.log("no paths specified!");
  }



  console.log("path_src:", path_src);
  console.log("path_search:", path_search);
  console.log("path_target:", path_target);
  console.log("maching:", maching);
  console.log("copy:", copy);

  console.log("files_src:", files_src);
  console.log("files_search:", files_search);
  console.log("maching_files:", maching_files);
  console.log("nonMachingFiles_src:", nonMachingFiles_src);
  console.log("nonMachingFiles_search:", nonMachingFiles_search);
}
