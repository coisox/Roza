<?php
	require_once('ROZA_Util.php');
	
	$data = [];
	//$prop = rozaGetArray("SELECT ui_data FROM roza_ui WHERE ui_id = ".$_GET['ROZA_UIID'], null);
	$prop = json_decode(file_get_contents('../dev/ui/'.$_GET['ROZA_UI']), true);

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
			if(!$prop[$i]['source']) {
				$error = 'Property "source" not defined for element data';
				$stmt = $conn->prepare("INSERT INTO roza_log (log_message) VALUES (?)");
				$stmt->bind_param('s', $error);
				$stmt->execute();
				$stmt->close();
				echo json_encode(['status' => 'System error occured and has been reported ('.$conn->insert_id.')']);
				die();
			}
			else if(!file_get_contents('../dev/sql/'.$prop[$i]['source'])) {
				$error = 'SQL file not found: '.$prop[$i]['source'];
				$stmt = $conn->prepare("INSERT INTO roza_log (log_message) VALUES (?)");
				$stmt->bind_param('s', $error);
				$stmt->execute();
				$stmt->close();
				echo json_encode(['status' => 'System error occured and has been reported ('.$conn->insert_id.')']);
				die();
			}
			else {
				$data = array_merge($data, rozaGetArray(file_get_contents('../dev/sql/'.$prop[$i]['source']), $prop[$i]['parameterize']));
				if(!rozaHasRole(['debug'])) {
					unset($prop[$i]['source']);
					unset($prop[$i]['parameterize']);
				}
			}
		}
		
		//========================================================================================= build list for standardlist, dropdown, radio, checkbox, table
		if(in_array($prop[$i]['element'], ['standardlist', 'dropdown', 'radio', 'checkbox', 'table'])) {
			if(!$prop[$i]['source']) {
				$error = 'Property "source" not defined for element data';
				$stmt = $conn->prepare("INSERT INTO roza_log (log_message) VALUES (?)");
				$stmt->bind_param('s', $error);
				$stmt->execute();
				$stmt->close();
				echo json_encode(['status' => 'System error occured and has been reported ('.$conn->insert_id.')']);
				die();
			}
			else if(!file_get_contents('../dev/sql/'.$prop[$i]['source'])) {
				$error = 'SQL file not found: '.$prop[$i]['source'];
				$stmt = $conn->prepare("INSERT INTO roza_log (log_message) VALUES (?)");
				$stmt->bind_param('s', $error);
				$stmt->execute();
				$stmt->close();
				echo json_encode(['status' => 'System error occured and has been reported ('.$conn->insert_id.')']);
				die();
			}
			else {
				$prop[$i]['list'] = rozaGetArray2D(file_get_contents('../dev/sql/'.$prop[$i]['source']), $prop[$i]['parameterize']);
				if(!rozaHasRole(['debug']) && $prop[$i]['element']!='table') {
					unset($prop[$i]['source']);
					unset($prop[$i]['parameterize']);
				}
			}
		}
		
		//========================================================================================= preprocessing vueTable
		if($prop[$i]['element']=='table') {
			$prop[$i]['list2'] = [];
			$hasAction = false;
			$actions = ['onview', 'onedit', 'ondelete'];

			for($j=0; $j<count($prop[$i]['column']); $j++) {
				
				if(eval('return ' . $prop[$i]['column'][$j]['ac_remove'] . ';')) {
					//simplify column
					$prop[$i]['column'][$j] = 'ac_remove';
				}
				else {
					
					//define column name
					$colname = $prop[$i]['column'][$j]['label'.rozaGetParam('rozaLanguage')];
					
					//simplify list
					for($k=0; $k<count($prop[$i]['list']); $k++) {
						$prop[$i]['list2'][$k][$colname] = rozaReplaceField($prop[$i]['column'][$j]['value'], $prop[$i]['list'][$k], false);
						
						for($l=0; $l<3; $l++) {
							if($prop[$i][$actions[$l]]['onclick']) {
								$hasAction = true;
								$prop[$i]['list2'][$k][$actions[$l]]['onclick'] = rozaReplaceField($prop[$i][$actions[$l]]['onclick'], $prop[$i]['list'][$k], false);
							}
							if($prop[$i][$actions[$l]]['ac_disable']) $prop[$i]['list2'][$k][$actions[$l]]['ac_disable'] = rozaReplaceField($prop[$i][$actions[$l]]['ac_disable'], $prop[$i]['list'][$k], false);
							if($prop[$i][$actions[$l]]['ac_hide']) $prop[$i]['list2'][$k][$actions[$l]]['ac_hide'] = rozaReplaceField($prop[$i][$actions[$l]]['ac_hide'], $prop[$i]['list'][$k], false);
							if($prop[$i][$actions[$l]]['ac_remove']) $prop[$i]['list2'][$k][$actions[$l]]['ac_remove'] = rozaReplaceField($prop[$i][$actions[$l]]['ac_remove'], $prop[$i]['list'][$k], false);
						}
					}
					
					//simplify column
					$prop[$i]['column'][$j] = $colname;
				}

			}
			
			if($hasAction) $prop[$i]['column'][] = rozaGetParam('rozaLanguage')=='bm'?'Tindakan':'Action';
			$prop[$i]['list'] = $prop[$i]['list2'];
			unset($prop[$i]['list2']);
		}
		
		//========================================================================================= attach onclick/onchange event for each standardlist items
		if($prop[$i]['element']=='standardlist') {
			for($j=0; $j<count($prop[$i]['list']); $j++) {
				if($prop[$i]['onclick']) $prop[$i]['list'][$j]['onclick'] = rozaReplaceField($prop[$i]['onclick'], $prop[$i]['list'][$j], false);
				if($prop[$i]['onchange']) $prop[$i]['list'][$j]['onchange'] = rozaReplaceField($prop[$i]['onchange'], $prop[$i]['list'][$j], false);
			}
			
			if(!rozaHasRole(['debug'])) {
				unset($prop[$i]['onclick']);
				unset($prop[$i]['onchange']);
			}
		}
		
		//========================================================================================= replace [[data_name]]
		foreach($prop[$i] as $key => $value)  {
			if(gettype($prop[$i][$key])=='string') {
				$prop[$i][$key] = rozaReplaceField($prop[$i][$key], $data, true);
			}
			else { //kalo bukan string dah tentu array
				for($j=0; $j<count($prop[$i][$key]); $j++) {
					if(gettype($prop[$i][$key][$j])=='string') $prop[$i][$key][$j] = rozaReplaceField($prop[$i][$key][$j], $data, true);
					else { //kalo bukan string dah tentu object
						foreach($prop[$i][$key][$j] as $key2 => $value2)  {
							if(gettype($prop[$i][$key][$j][$key2])=='string') $prop[$i][$key][$j][$key2] = rozaReplaceField($prop[$i][$key][$j][$key2], $data, true);
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