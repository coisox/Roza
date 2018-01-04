rozaSetPanel({
	panel: rozaGetParam('staff_id')?'rightPanel':'fullPanel',
	ui: 'SampleStaff_Form.json'
});

function onloadState() {
	rozaModal({
		contentbm: 'Negeri telah di \'load\' sebagai '+$('#state').val(),
		contentbi: 'State has been loaded as '+$('#state').val()
	});
}

function rozaDragged(event) {
	console.log(event);
	rozaModal({
		contentbm: 'Item sudah di drag. Buat laa pape yg patut',
		contentbi: 'Item has been dragged. Do what ever you need here'
	});
}