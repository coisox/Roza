rozaSetPanel({
	panel: rozaGetParam('staff_id')?'rightPanel':'fullPanel',
	ui: 'SampleStaff_Form.json'
});

function onloadState() {
	alert('State loaded: '+$('#state').val());
}