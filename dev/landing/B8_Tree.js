rozaSetPanel({
	panel: 'leftPanel',
	ui: 'B8_Tree.json'
});

rozaSetTaskbar({
	ui: 'SampleStaff_Taskbar.json'
});

var needMarkup = true;
function resizeIframe(iframe) {
	iframe.height = iframe.contentWindow.document.body.scrollHeight + (needMarkup?140:0) + "px";
	needMarkup = false;
	//setTimeout(function(){resizeIframe(iframe)},100);
}