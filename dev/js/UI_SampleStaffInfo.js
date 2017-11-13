rozaSetPanel({
	panel: rozaGetParam('staff_id')?'rightPanel':'fullPanel',
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
	console.log('okBeingClicked');
}