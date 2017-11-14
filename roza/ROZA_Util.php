<?php

error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
$globalUserId = '-1';
$globalUserName = 'Roza';
$conn = new mysqli('ilims.ansi.com.my', 'admin', 'Xs2mysql_admin', 'roza');

if(mysqli_connect_errno()) {
	$timestamp = date("YmdHis");
	file_put_contents("error.log", $timestamp . "\t\t" . 'Connection error: '. mysqli_connect_errno() . "\n\n", FILE_APPEND);
	echo json_encode(['status' => "Connection error"]);
	die();
}

session_start();

/*
function generateMenu() {
	$rs = rozaExecuteQuery("
		SELECT
			t0.menu_id 'id_0', t0.menu_labelbm 'labelbm_0', t0.menu_labelbi 'labelbi_0',
			t1.menu_id 'id_1', t1.menu_labelbm 'labelbm_1', t1.menu_labelbi 'labelbi_1',
			t2.menu_id 'id_2', t2.menu_labelbm 'labelbm_2', t2.menu_labelbi 'labelbi_2',
			t3.menu_id 'id_3', t3.menu_labelbm 'labelbm_3', t3.menu_labelbi 'labelbi_3',
			t4.menu_id 'id_4', t4.menu_labelbm 'labelbm_4', t4.menu_labelbi 'labelbi_4'
		FROM roza_menu AS t0
			LEFT JOIN roza_menu AS t1 ON t1.menu_parent_id = t0.menu_id
			LEFT JOIN roza_menu AS t2 ON t2.menu_parent_id = t1.menu_id
			LEFT JOIN roza_menu AS t3 ON t3.menu_parent_id = t2.menu_id
			LEFT JOIN roza_menu AS t4 ON t4.menu_parent_id = t3.menu_id
		WHERE t0.menu_parent_id = 0
	", null);
	
	$menus = array();
	while($row = $rs->fetch_assoc()) {
		$menus[] = {
			'menu_id' => $row['id_0'],
			'menu_labelbm' => $row['labelbm_0'],
			'menu_labelbi' => $row['labelbi_0'],
			'child' => array() //stop here
		};
	}
}
*/

function str_replace_first($search, $replace, $subject) {
    $pos = strpos($subject, $search);
    if ($pos !== false) {
        return substr_replace($subject, $replace, $pos, strlen($search));
    }
    return $subject;
}

function rozaReplaceParam($string) {
	preg_match_all("/(\{\{)(.*)(\}\})/U", $string, $pat_array);
	for($i=0; $i<count($pat_array[0]); $i++) $string = str_replace('{{'.$pat_array[2][$i].'}}', rozaGetParam($pat_array[2][$i]), $string);

	return $string;
}

function rozaReplaceField($string, $fields) {
	preg_match_all("/(\[\[)(.*)(\]\])/U", $string, $pat_array);
	for($i=0; $i<count($pat_array[0]); $i++) $string = str_replace('[['.$pat_array[2][$i].']]', $fields[$pat_array[2][$i]], $string);
	
	return $string;
}

function rozaExecuteQuery($sql, $params) {
	$conn = $GLOBALS['conn'];
	
	preg_match_all("/(\[\[)(.*)(\]\])/U", $string, $pat_array);
	if(count($pat_array[0])>0) {
		$stmt = $conn->prepare("INSERT INTO roza_log (log_message, log_sql) VALUES ('Cannot use [[field_name]] in SQL', ?)");
		$stmt->bind_param('s', $sql);
		$stmt->execute();
		$stmt->close();
		echo json_encode(['status' => 'System error occured and has been reported ('.$conn->insert_id.')']);
		die();
	}

	$stmt = $conn->prepare($sql);
	
	if($stmt === false) {
		$error = $conn->error;
		$stmt = $conn->prepare("INSERT INTO roza_log (log_message, log_sql) VALUES (?, ?)");
		$stmt->bind_param('ss', $error, $sql);
		$stmt->execute();
		$stmt->close();
		echo json_encode(['status' => 'System error occured and has been reported ('.$conn->insert_id.')']);
		die();
	}

	$types = '';
	for($i=0; $i<count($params); $i++) {
		$types .= 's';
		$params[$i] = rozaReplaceParam($params[$i]);
	}
	$stmt->bind_param($types, ...$params);
	
	$stmt->execute();
	$result = $stmt->get_result();
	$stmt->close();

	return $result;
}

function rozaGetStandardList_BAK($sql, $param) {
	$rs = rozaExecuteQuery($sql, $param);
	$info = $rs->fetch_fields();
	$fields = [];
	foreach ($info as $i) $fields[] = $i->name;
	$totalFields = count($fields);

	$list = [];
	while($row = $rs->fetch_assoc()) {
		$arr = [];
		for($i=0; $i<$totalFields; $i++) $arr[$fields[$i]] = $row[$fields[$i]];
		$arr['ROZA_TIME'] = date_format(new DateTime($row['ROZA_TIME']),"d/m/y H:iA");
		$arr['ROZA_EPOCH'] = date_format(new DateTime($row['ROZA_TIME']),"U");
		$list[] = $arr;
	}
	
	return $list;
}

function rozaGetDropdownList($sql, $param) {
	$rs = rozaExecuteQuery($sql, $param);
	if($row = $rs->fetch_assoc()) return $row[$rs->fetch_fields()[0]->name];
	else return json_encode('{}');
}

function rozaGetArray($sql, $param) {
	$return = '{}';
	$rs = rozaExecuteQuery($sql, $param);
	if($row = $rs->fetch_assoc()) $return = $row[$rs->fetch_fields()[0]->name];
	return json_decode($return, true);
}

function rozaGetArray2D($sql, $param) {
	$rs = rozaExecuteQuery($sql, $param);
	$list = [];
	while($row = $rs->fetch_assoc()) {
		$obj = json_decode($row[$rs->fetch_fields()[0]->name], true);
		if($obj['ROZA_TIME']) {
			$obj['ROZA_TIME'] = date_format(new DateTime($obj['ROZA_TIME']),"d/m/y H:iA");
			$obj['ROZA_EPOCH'] = date_format(new DateTime($obj['ROZA_TIME']),"U");
		}
		$list[] = $obj;
	}
	
	return $list;
}

function rozaGetUi_BAK($id) {
	$return = '{}';
	
	$sql = "
		SELECT ui_data 
		FROM roza_ui
		WHERE ui_id = '".$id."'
	";
		
	$rs = rozaExecuteQuery($sql, null);
	if($row = $rs->fetch_assoc()) $return = $row['ui_data'];

	return json_decode($return, true);
}

function rozaGetParam($name) {
	if($name=='globalUserId') return $GLOBALS['globalUserId'];
	else if($name=='globalUserName') return $GLOBALS['globalUserName'];
	else if($name=='globalUserRole') return $GLOBALS['globalUserRole'];
	else return isset($_GET[$name])?$_GET[$name]:'undefined';
}

?>