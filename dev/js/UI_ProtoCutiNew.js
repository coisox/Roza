rozaSetPanel({
	panel: 'fullPanel',
	ui: 4
});

function fakeSend() {
	rozaModal();
	setTimeout(function(){
		rozaModal({
			labelbm: 'Permohonan tekah dihantar!',
			labelbi: 'Application submitted!',
			onclick: "rozaCallLandingFile('UI_ProtoTask.js')"
		});
	}, 1000);
}