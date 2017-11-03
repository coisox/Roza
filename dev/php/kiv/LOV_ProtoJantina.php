<?php
	require_once('config.php');
	
	$sql = "
		SELECT lov_data
		FROM proto_lov
		WHERE lov_id = 2
	";
	
	$rs = rozaExecuteQuery($sql);
	$data = '{}';
	if($row = $rs->fetch_assoc()) $data = $row[array_keys($row)[0]];

	echo json_encode([
		'status' => 'ok',
		'data' => $data
	]);
?>