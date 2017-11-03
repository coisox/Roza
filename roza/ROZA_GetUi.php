<?php
	require_once('ROZA_Util.php');

	$prop = rozaGetUi(rozaGetParam('id'));
	$data = [];

	for($i=0; $i<count($prop); $i++) {
		
		if(gettype($prop[$i]['source'])=='string') { //SQL
			$prop[$i]['source'] = rozaReplaceParam($prop[$i]['source']);
		}
		else if($prop[$i]['source']) { //Object
			foreach($prop[$i]['source'] as $key => $value) {
				$prop[$i]['source'][$key] = rozaReplaceParam($prop[$i]['source'][$key]);
			}
		}
		
		for($j=0; $j<count($prop[$i]['source_param']); $j++) {
			$prop[$i]['source_param'][$j] = rozaReplaceParam($prop[$i]['source_param'][$j]);
		}
		
		//=================================================================================== standardlist
		if($prop[$i]['type']=='standardlist') {
			$prop[$i]['list'] = rozaGetStandardList($prop[$i]['source'], $prop[$i]['source_param']);
			
			//roza event
			for($j=0; $j<count($prop[$i]['list']); $j++) {
				if(isset($prop[$i]['onclick'])) {
					$prop[$i]['list'][$j]['onclick'] = rozaReplaceField(rozaReplaceParam($prop[$i]['onclick']), $prop[$i]['list'][$j]);
				}
			}
		}
		
		//=================================================================================== data
		else if($prop[$i]['type']=='data') {
			if(gettype($prop[$i]['source'])=='string') {
				$data = array_merge($data, json_decode(rozaGetData($prop[$i]['source'], $prop[$i]['source_param']), true));
			}
			else {
				$data = array_merge($data, $prop[$i]['source']);
			}
		}
		
		//=================================================================================== element
		else {
			if($data[$prop[$i]['id']]) $prop[$i]['value'] = $data[$prop[$i]['id']];
			
			if($prop[$i]['type']=='dropdown') {
				if(gettype($prop[$i]['source'])=='string') { //SQL
					$prop[$i]['list'] = json_decode(rozaGetData($prop[$i]['source'], $prop[$i]['source_param']), true);
				}
				else { //Array of object
					$prop[$i]['list'] = $prop[$i]['source'];
				}
			}
		}
		
	}
	
	echo json_encode([
		'status' => 'ok',
		'prop' => $prop
	]);
	
?>