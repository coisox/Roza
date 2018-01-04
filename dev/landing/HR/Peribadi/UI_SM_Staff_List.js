/*rozaSetTaskbar({
	ui: 'HR/Peribadi/SM_Taskbar.json'
});*/

rozaSetPanel({
	panel: 'leftPanel',
	ui: 'HR/Peribadi/SM_Staff_List.json'
});

rozaSetPanel({
	panel: 'rightPanel',
	ui: 'HR/Peribadi/SM_Tab_Peribadi.json'
});

//onLoad 
function ServiceStatus() {
    //alert ($('#ServiceStatus').val());
    if ($('#ServiceStatus').val() != 'K') {
        //assign value
        $('#CEndDate').val(null);
        $('#C2EndDate').val(null);
        $('#C3EndDate').val(null);
    } 
}