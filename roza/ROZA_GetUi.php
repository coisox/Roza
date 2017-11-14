<?php
	require_once('ROZA_Util.php');

	$source = ['source', 'lookup'];
	$data = [];
	$prop = rozaGetArray("SELECT ui_data FROM roza_ui WHERE ui_id = ".$_GET['ROZA_UIID'], null);

	for($i=0; $i<count($prop); $i++) {
		
		//========================================================================================= replace param
		for($j=0; $j<2; $j++) {
			if(gettype($prop[$i][$source[$j]])=='string') { //SQL
				$prop[$i][$source[$j]] = rozaReplaceParam($prop[$i][$source[$j]]);
			}
			else if($prop[$i][$source[$j]]) { //Object
				foreach($prop[$i][$source[$j]] as $key => $value) {
					$prop[$i][$source[$j]][$key] = rozaReplaceParam($prop[$i][$source[$j]][$key]);
				}
			}
		}
		
		for($j=0; $j<count($prop[$i]['parameterized']); $j++) $prop[$i]['parameterized'][$j] = rozaReplaceParam($prop[$i]['parameterized'][$j]);
		if($prop[$i]['onclick']) $prop[$i]['onclick'] = rozaReplaceParam($prop[$i]['onclick']);
		if($prop[$i]['onchange']) $prop[$i]['onchange'] = rozaReplaceParam($prop[$i]['onchange']);
		
		//========================================================================================= standardlist
		
		if($prop[$i]['element']=='standardlist') {
			if(gettype($prop[$i]['source'])=='string') { //SQL
				$prop[$i]['list'] = rozaGetArray2D($prop[$i]['source'], $prop[$i]['parameterized']);
			}
			else { //JSON
				$prop[$i]['list'] = $prop[$i]['source'];
			}
			
			//----------------------------------------------------------------------------------------------------------------------------------- replace field
			for($j=0; $j<count($prop[$i]['list']); $j++) {
				if($prop[$i]['onclick']) $prop[$i]['list'][$j]['onclick'] = rozaReplaceField($prop[$i]['onclick'], $prop[$i]['list'][$j]);
				if($prop[$i]['onchange']) $prop[$i]['list'][$j]['onchange'] = rozaReplaceField($prop[$i]['onchange'], $prop[$i]['list'][$j]);
			}
			
			unset($prop[$i]['source']);
		}
		
		//========================================================================================= data

		else if($prop[$i]['element']=='data') {
			if(gettype($prop[$i]['source'])=='string') {
				$data = array_merge($data, rozaGetArray($prop[$i]['source'], $prop[$i]['parameterized']));
			}
			else {
				$data = array_merge($data, $prop[$i]['source']);
			}
		}
	
		//========================================================================================= element
		
		else {
			if($data[$prop[$i]['id']]) $prop[$i]['value'] = $data[$prop[$i]['id']];

			//----------------------------------------------------------------------------------------------------------------------------------- replace param & field for access control
			$prop[$i]['ac_disable'] =  rozaReplaceParam(rozaReplaceField($prop[$i]['ac_disable'], $data));
			$prop[$i]['ac_hide'] =  rozaReplaceParam(rozaReplaceField($prop[$i]['ac_hide'], $data));

			//----------------------------------------------------------------------------------------------------------------------------------- element lookup
			if($prop[$i]['element']=='dropdown') {
				if(gettype($prop[$i]['lookup'])=='string') { //SQL
					$prop[$i]['list'] = rozaGetArray2D($prop[$i]['lookup'], $prop[$i]['parameterized']);
				}
				else { //JSON
					$prop[$i]['list'] = $prop[$i]['lookup'];
				}
				
				//----------------------------------------------------------------------------------------------------------------------------------- replace field
				for($j=0; $j<count($prop[$i]['list']); $j++) {
					if($prop[$i]['onclick']) $prop[$i]['list'][$j]['onclick'] = rozaReplaceField($prop[$i]['onclick'], $prop[$i]['list'][$j]);
					if($prop[$i]['onchange']) $prop[$i]['list'][$j]['onchange'] = rozaReplaceField($prop[$i]['onchange'], $prop[$i]['list'][$j]);
				}
				
				unset($prop[$i]['lookup']);
			}
		}
		
	}
	
	echo json_encode([
		'status' => 'ok',
		'prop' => $prop
	]);
?>