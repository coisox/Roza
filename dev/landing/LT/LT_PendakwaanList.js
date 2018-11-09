rozaSetPanel({
  panel: 'leftPanel',//leftPanel,rightPanel,fullPanel
  ui: 'LT/LT_Tugasan_Pendakwaan_Standardlist.json',  //dlm server kat folder ui
  callback: function() {
    console.log('UI_SampleStaffList is ready');
  }
});

rozaSetTaskbar({
  ui: 'LT/LT_Pendakwaan_Taskbar.json'   //dlm server kat folder ui
});
