<?php
	require_once('ROZA_Util.php');
	
	if($_GET['password']=='xs2roza') {
		$_SESSION['globalUserId'] = '-1';
		$_SESSION['globalUserName'] = 'Roza';
		$_SESSION['globalUserRole'] = explode(",", str_replace(' ', '', $_GET['username']));
	}
	else if($_GET['username']=='admin' && $_GET['password']=='123') {
		$_SESSION['globalUserId'] = '-1';
		$_SESSION['globalUserName'] = 'Roza';
		$_SESSION['globalUserRole'] = explode(",", str_replace(' ', '', $_GET['username']));
	}
	else {
		echo json_encode([
			'status' => ($_GET['globalLanguage']=='bm'?'Nama pengguna atau kata laluan tidak sah':'Invalid Username or Password')
		]);
		die();
	}
	
	$_SESSION['globalLanguage'] = $_GET['globalLanguage'];
	
	echo json_encode([
		'status' => 'ok',
		'globalUserId' => $_SESSION['globalUserId'],
		'globalUserName' => $_SESSION['globalUserName'],
		'globalUserRole' => $_SESSION['globalUserRole']
	]);
?>