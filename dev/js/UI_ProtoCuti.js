rozaSetPanel({
	panel: 'leftPanel',
	ui: 2
});

function stateChanged() {
	rozaModal({
		title: 'Modal Title',
		content: 'Lorem Ipsum',
		cancel: true,
		action: 'okBeingClicked()'
	});
}

function okBeingClicked() {
	//do stuff here
	alert('okBeingClicked');
}