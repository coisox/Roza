rozaSetTaskbar({
	ui: 'HR/Peribadi/SM_Taskbar.json'
});

rozaSetPanel({
	panel: rozaGetParam('nama') ? 'rightPanel' : 'rightPanel',
	ui: 'HR/Peribadi/SM_Peribadi_KesihatanKelBaru.json'
});