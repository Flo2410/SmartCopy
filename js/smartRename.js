const electron = require('electron');
const remote = electron.remote;
const mainProcess = remote.require('./app');


$("#path_src").click(() => {
  mainProcess.selectFiles().then((filename) => {
    $("#path_src_file").val(filename);
  }).catch(() => {
    $("#path_src_file").val("Choose files");
  });
});

$("#check").click(() => {
  const search = $("#search").val();
  let replacement = $("#replacement").val();
  if(replacement === "") {
    replacement = "*";
    $("#replacement").val("*");
  }
  const copy = $("#copy_checkbox").prop('checked');

  const new_src = mainProcess.smartRename(search, replacement, copy);
  if(new_src) $("#path_src_file").val(new_src.toString());
});

$("#btn_back").click(() => {
  mainProcess.openMainWindow();
});

$("body").keypress((event) => {
  if (event.keyCode === 13) {
    $("#check").click();
  }
});
