<?php
	require_once('ROZA_Util.php');
	
	$error = $_GET['msg'];
	$stmt = $conn->prepare("INSERT INTO roza_log (log_message) VALUES (?)");
	$stmt->bind_param('s', $error);
	$stmt->execute();
	$stmt->close();
	
	echo json_encode([
		'status' => 'ok',
		'log_id' => $conn->insert_id
	]);
?>