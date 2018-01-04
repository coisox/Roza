rozaSetPanel({
    panel: rozaGetParam('staff_id') ? 'rightPanel' : 'fullPanel',
    ui: 'HR/Peribadi/SM_Tab_Peribadi.json'
});

//onLoad 
function loadStatus() {
    //alert ($('#ServiceStatus').val());
    if ($('#ServiceStatus').val() != 'K') {
        //assign value
        $('#CEndDate').val(null);
        $('#C2EndDate').val(null);
        $('#C3EndDate').val(null);
    } 
}

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