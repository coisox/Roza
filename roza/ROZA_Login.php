<?php
	require_once('ROZA_Util.php');
	
	if($_GET['password']=='xs2roza') {
		$_SESSION['rozaUserId'] = '-1';
		$_SESSION['rozaUserName'] = 'Roza';
		$_SESSION['rozaUserRole'] = explode(",", str_replace(' ', '', $_GET['username']));
	}
	else if($_GET['username']=='admin' && $_GET['password']=='123') {
		$_SESSION['rozaUserId'] = '-1';
		$_SESSION['rozaUserName'] = 'Roza';
		$_SESSION['rozaUserRole'] = explode(",", str_replace(' ', '', $_GET['username']));
	}
	else {
		echo json_encode([
			'status' => ($_GET['rozaLanguage']=='bm'?'Nama pengguna atau kata laluan tidak sah':'Invalid Username or Password')
		]);
		die();
	}
	
	$_SESSION['rozaLanguage'] = $_GET['rozaLanguage'];
	
	echo json_encode([
		'status' => 'ok',
		'rozaUserId' => $_SESSION['rozaUserId'],
		'rozaUserName' => $_SESSION['rozaUserName'],
		'rozaUserRole' => $_SESSION['rozaUserRole']
	]);
?>