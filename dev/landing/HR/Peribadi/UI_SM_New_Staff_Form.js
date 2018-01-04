rozaSetTaskbar({
	ui: 'HR/Peribadi/SM_Taskbar.json'
});

rozaSetPanel({
	panel: 'fullPanel',
	ui: 'HR/Peribadi/SM_New_Staff_Form.json',
	callback: function(){
		alert ('TEST');
	}
});
	
//onChange for dropdown Service Status : Kontrak, Tetap, Sambilan
function ServiceStatus() {
    //alert ($('#ServiceStatus').val());
    if ($('#ServiceStatus').val() == 'K') {
        //enable field
        $('#CEndDate').prop('disabled', false);
        $('#C2EndDate').prop('disabled', false);
        $('#C3EndDate').prop('disabled', false);

    } else //if ($('#ServiceStatus').val() == 'K') 
    {
        //assign value
        $('#CEndDate').val(null);
        $('#C2EndDate').val(null);
        $('#C3EndDate').val(null);
        //disable field
        $('#CEndDate').prop('disabled', true);
        $('#C2EndDate').prop('disabled', true);
        $('#C3EndDate').prop('disabled', true);
    }
}