<?php
	require_once('ROZA_Util.php');
	
	$data = [];
	$prop = rozaGetArray("SELECT ui_data FROM roza_ui WHERE ui_id = ".$_GET['ROZA_UIID'], null);

	for($i=0; $i<count($prop); $i++) {
		
		//========================================================================================= replace {{param_name}}
		foreach($prop[$i] as $key => $value)  {
			if(gettype($prop[$i][$key])=='string') {
				$prop[$i][$key] = rozaReplaceParam($prop[$i][$key]);
			}
			else { //kalo bukan string dah tentu array
				for($j=0; $j<count($prop[$i][$key]); $j++) {
					if(gettype($prop[$i][$key][$j])=='string') $prop[$i][$key][$j] = rozaReplaceParam($prop[$i][$key][$j]);
					else { //kalo bukan string dah tentu object
						foreach($prop[$i][$key][$j] as $key2 => $value2)  {
							if(gettype($prop[$i][$key][$j][$key2])=='string') $prop[$i][$key][$j][$key2] = rozaReplaceParam($prop[$i][$key][$j][$key2]);
						}
					}
				}
			}
		}
		
		//========================================================================================= data
		if($prop[$i]['element']=='data') {
			$data = array_merge($data, rozaGetArray(file_get_contents('../dev/sql/'.$prop[$i]['source']), $prop[$i]['parameterize']));
			if(!rozaHasRole(['debug'])) {
				unset($prop[$i]['source']);
				unset($prop[$i]['parameterize']);
			}
		}
		
		//========================================================================================= build list for standardlist or dropdown
		if($prop[$i]['element']=='standardlist' || $prop[$i]['element']=='dropdown') {
			$prop[$i]['list'] = rozaGetArray2D(file_get_contents('../dev/sql/'.$prop[$i]['source']), $prop[$i]['parameterize']);
			if(!rozaHasRole(['debug'])) {
				unset($prop[$i]['source']);
				unset($prop[$i]['parameterize']);
			}
		}
		
		//========================================================================================= attach onclick/onchange event for each standardlist items
		if($prop[$i]['element']=='standardlist') {
			for($j=0; $j<count($prop[$i]['list']); $j++) {
				if($prop[$i]['onclick']) $prop[$i]['list'][$j]['onclick'] = rozaReplaceField($prop[$i]['onclick'], $prop[$i]['list'][$j]);
				if($prop[$i]['onchange']) $prop[$i]['list'][$j]['onchange'] = rozaReplaceField($prop[$i]['onchange'], $prop[$i]['list'][$j]);
			}
			
			if(!rozaHasRole(['debug'])) {
				unset($prop[$i]['onclick']);
				unset($prop[$i]['onchange']);
			}
		}
		
		//========================================================================================= replace [[data_name]]
		foreach($prop[$i] as $key => $value)  {
			if(gettype($prop[$i][$key])=='string') {
				$prop[$i][$key] = rozaReplaceField($prop[$i][$key], $data);
			}
			else { //kalo bukan string dah tentu array
				for($j=0; $j<count($prop[$i][$key]); $j++) {
					if(gettype($prop[$i][$key][$j])=='string') $prop[$i][$key][$j] = rozaReplaceField($prop[$i][$key][$j], $data);
					else { //kalo bukan string dah tentu object
						foreach($prop[$i][$key][$j] as $key2 => $value2)  {
							if(gettype($prop[$i][$key][$j][$key2])=='string') $prop[$i][$key][$j][$key2] = rozaReplaceField($prop[$i][$key][$j][$key2], $data);
						}
					}
				}
			}
		}

		//========================================================================================= bind data
		if($prop[$i]['element']!='standardlist' && $prop[$i]['element']!='data' && $data[$prop[$i]['id']]) {
			$prop[$i]['value'] = $data[$prop[$i]['id']];
		}
		
	}
	
	echo json_encode([
		'status' => 'ok',
		'prop' => $prop
	]);
?>