const electron = require('electron');
const remote = electron.remote;
const mainProcess = remote.require('./app');


$("#folderCompare").click(() => {
  mainProcess.openFolderCompare();
});
