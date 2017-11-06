rozaSetPanel({
	panel: 'rightPanel',
	ui: 2
});

function stateChanged() {
	rozaModal({
		labelbm: 'Negeri bertukar!',
		labelbi: 'State changed!',
		cancel: true,
		onclick: 'okBeingClicked()'
	});
}

function okBeingClicked() {
	//do stuff here
	alert('okBeingClicked');
}