<?php
	require_once('ROZA_Util.php');
	
	$data = [];
	
	//========================================================================================= get json as string then replace param
	$prop = rozaReplaceParam(file_get_contents('../dev/ui/'.$_GET['ROZA_UI']));
	$prop = json_decode(preg_replace('!/\*.*?\*/!s', '', $prop), true);

	//========================================================================================= prepare 1st level data
	for($i=0; $i<count($prop); $i++) {
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
					unset($prop[$i]);
				}
			}
		}
		else break;
	}
	
	//========================================================================================= convert object to string then replace field (1st level)
	$prop = rozaReplaceField(json_encode(array_values($prop)), $data, false);
	$prop = json_decode(preg_replace('!/\*.*?\*/!s', '', $prop), true);
	
	
	//========================================================================================= looping for generated list
	for($i=0; $i<count($prop); $i++) {
		
		//========================================================================================= build list for standardlist, dropdown, radio, checkbox, table, timeline
		if(in_array($prop[$i]['element'], ['standardlist', 'dropdown', 'radio', 'checkbox', 'table', 'timeline'])) {
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
				if($prop[$i]['element']!='table') { //jika table, even bukan debug mode, kita nak retain source utk tujuan refresh bila data berubah.
					if(!rozaHasRole(['debug'])) {
						unset($prop[$i]['source']);
						unset($prop[$i]['parameterize']);
					}
				}
			}
		}
		
		//========================================================================================= preprocessing table to vueTable compatible
		if($prop[$i]['element']=='table') {
			if(count($prop[$i]['list'])<11) $prop[$i]['smallrecord'] = true;
			if(isset($prop[$i]['sortable']) && $prop[$i]['sortable']==false) $prop[$i]['nosort'] = true;
			$prop[$i]['list2'] = [];
			$hasAction = false;
			$actions = ['action_view', 'action_edit', 'action_delete', 'action_drag', 'action_add'];

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
						
						for($l=0; $l<count($actions); $l++) {
							if($prop[$i][$actions[$l]]['onclick']) {
								$hasAction = true;
								$prop[$i]['list2'][$k][$actions[$l]]['onclick'] = rozaReplaceField($prop[$i][$actions[$l]]['onclick'], $prop[$i]['list'][$k], false);
							}
							if($prop[$i][$actions[$l]]['ac_dualmode']) {
								$hasAction = true;
								$prop[$i]['list2'][$k][$actions[$l]]['ac_dualmode'] = rozaReplaceField($prop[$i][$actions[$l]]['ac_dualmode'], $prop[$i]['list'][$k], false);
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
		
		//========================================================================================= attach onclick event for each standardlist items
		if($prop[$i]['element']=='standardlist') {
			for($j=0; $j<count($prop[$i]['list']); $j++) {
				if($prop[$i]['onclick']) $prop[$i]['list'][$j]['onclick'] = rozaReplaceField($prop[$i]['onclick'], $prop[$i]['list'][$j], false);
				if($prop[$i]['action']) $prop[$i]['list'][$j]['action'] = json_decode(rozaReplaceField(json_encode($prop[$i]['action']), $prop[$i]['list'][$j], false), true);
			}
			
			unset($prop[$i]['onclick']);
		}
		
		//========================================================================================= attach info for each timeline items
		if($prop[$i]['element']=='timeline') {
			for($j=0; $j<count($prop[$i]['list']); $j++) {
				if($prop[$i]['info']) $prop[$i]['list'][$j]['info'] = json_decode(rozaReplaceField(json_encode($prop[$i]['info']), $prop[$i]['list'][$j], false), true);
			}
			
			unset($prop[$i]['info']);
		}
		
		//========================================================================================= bind value (1st level data)
		if(!in_array($prop[$i]['element'], ['standardlist', 'data', 'table']) && $data[$prop[$i]['id']]) {
			$prop[$i]['value'] = $data[$prop[$i]['id']];
		}
	}
	
	
	//========================================================================================= convert object to string then replace field (1st level). This time for newly generated list
	$prop = rozaReplaceField(json_encode(array_values($prop)), $data, false);
	$prop = json_decode(preg_replace('!/\*.*?\*/!s', '', $prop), true);
	
	
	echo json_encode([
		'status' => 'ok',
		'prop' => $prop
	]);
?>