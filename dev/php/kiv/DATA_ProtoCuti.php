<?php
	require_once('config.php');

	//OPTION 1: Produce JSON from normal query
	//============================================
	$sql = "
		SELECT
			JSON_OBJECT(
				'nama', 'Aizal Manan',
				'negeri', 'KUL',
				'jantina', 'L'
			)
		FROM DUAL
	";
	
	$rs = rozaExecuteQuery($sql);
	$data = '{}';
	if($row = $rs->fetch_assoc()) $data = $row[array_keys($row)[0]];
	//============================================
	
	
	//OPTION 2: Get JSON datatype
	//============================================
	$sql = "
		SELECT data_data
		FROM proto_data
		WHERE data_id = ?
	";
	
	//$rs = rozaExecuteQuery($sql, rozaGetParam('id'));
	//$data = '{}';
	//if($row = $rs->fetch_assoc()) $data = $row[array_keys($row)[0]];
	//============================================

	
	echo json_encode([
		'status' => 'ok',
		'data' => $data
	]);
?>