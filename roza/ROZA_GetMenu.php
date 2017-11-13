<?php
	require_once('ROZA_Util.php');

	$rs = rozaExecuteQuery("SELECT menu_data FROM roza_menu ORDER BY menu_order", null);
	$data = array();
	while($row = $rs->fetch_assoc()) {
		$data[] = json_decode($row['menu_data'], true);
	}
	
	echo json_encode([
		'status' => 'ok',
		'data' => $data
	]);
	
?>