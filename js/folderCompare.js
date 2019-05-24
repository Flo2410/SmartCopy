const electron = require('electron');
const remote = electron.remote;
const mainProcess = remote.require('./app');


$("#path_src").click(() => {
  mainProcess.selectDirectory("path_src").then((filename) => {
    $("#path_src_file").val(filename);
  }).catch(() => {
    $("#path_src_file").val("Choose file");
  });
});


$("#path_search").click(() => {
  mainProcess.selectDirectory("path_search").then((filename) => {
    $("#path_search_file").val(filename);
  }).catch(() => {
    $("#path_search_file").val("Choose file");
  });
});

$("#path_target").click(() => {
  mainProcess.selectDirectory("path_target").then((filename) => {
    $("#path_target_file").val(filename);
  }).catch(() => {
    $("#path_target_file").val("Choose file");
  });
});

$("#check").click(() => {
  const maching = $("#select_maching").val();
  const copy = $("#select_copy").val();
  mainProcess.check(JSON.parse(maching), JSON.parse(copy));
});

$("#btn_back").click(() => {
  mainProcess.openMainWindow();
});
