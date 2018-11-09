$.ajax({
	type: 	"POST",
	dataType: "json",
	url:	"dev/php/LT/SemakStatusTugasan.php",
	data: 	'ROZA_ID='+rozaGetParam('ROZA_ID')+'&PROCESS_ID='+rozaGetParam('PROCESS_ID')+'&MODULE_ID='+rozaGetParam('MODULE_ID'),
	success: function(data){
		if(data.status=='ok') {
			rozaSetPanel({
			  panel: 'rightPanel',//leftPanel,rightPanel,fullPanel
			  ui: 'LT/LT_Tugasan_Pendakwaan_tabForm.json',  //dlm server kat folder ui
			  callback: function() {
				console.log('UI_SampleStaffList is ready');
			  }
			});
		}
		else {
			rozaModal({
				labelbm: 'Terima Tugasan',
				labelbi: 'Accept Task',
				cancel: true, //optional
				onclick: 'alert("sini panggil BL utk update status terima tugasan")' //optional
			});
		}
	}
});

/*
rozaSetPanel({
  panel: 'rightPanel',//leftPanel,rightPanel,fullPanel
  ui: 'LT/ui_LT_Pendakwaan_tugasan_tabForm.json',  //dlm server kat folder ui
  callback: function() {
    console.log('UI_SampleStaffList is ready');
  }
});
*/