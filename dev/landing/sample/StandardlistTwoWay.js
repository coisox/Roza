rozaSetPanel({
	panel: 'leftPanel',
	ui: 'sample/StandardlistTwoWay_Left.json'
});

rozaSetPanel({
	panel: 'rightPanel',
	ui: 'sample/StandardlistTwoWay_Right.json'
});

function transfer(staffID) {
	var fromList = $('#modalProp #status:checked').val()=='Approved'?'leftPanel':'rightPanel';
	var toList = $('#modalProp #status:checked').val()=='Approved'?'rightPanel':'leftPanel';
	
	for(var x=0; x<roza.panel[fromList].prop[0].list.length; x++) {
		if(roza.panel[fromList].prop[0].list[x].ROZA_ID==staffID) {
			var item = roza.panel[fromList].prop[0].list.splice(x, 1)[0];
			
			//terbalikkan arrow
			if(item.action.icon=="fa fa-long-arrow-left") item.action.icon = "fa fa-long-arrow-right";
			else item.action.icon = "fa fa-long-arrow-left";
			
			roza.panel[toList].prop[0].list.unshift(item);
		}
	}
	rozaModal();
}