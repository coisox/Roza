<?php
	require_once('ROZA_Util.php');
	
	if(
		$_SESSION['rozaUserId'] &&
		$_SESSION['rozaUserName'] &&
		$_SESSION['rozaUserRole'] &&
		$_SESSION['rozaLanguage']
	) {
		$rs = rozaExecuteQuery("SELECT menu_data FROM roza_menu ORDER BY menu_order", null);
		$data = array();
		while($row = $rs->fetch_assoc()) {
			$data[] = json_decode($row['menu_data'], true);
		}
		
		echo json_encode([
			'status' => 'ok',
			'data' => $data
		]);
	}
	else {
		echo json_encode([
			'status' => 'invalid session',
			'rozaUserId' => $_SESSION['rozaUserId'],
			'rozaUserName' => $_SESSION['rozaUserName'],
			'rozaUserRole' => $_SESSION['rozaUserRole'],
			'rozaLanguage' => $_SESSION['rozaLanguage']
		]);
	}
	
?>