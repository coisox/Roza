<?php

error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
$conn = new mysqli('ilims.ansi.com.my', 'admin', 'Xs2mysql_admin', 'roza');

if(mysqli_connect_errno()) {
	$timestamp = date("YmdHis");
	file_put_contents("error.log", $timestamp . "\t\t" . 'Connection error: '. mysqli_connect_errno() . "\n\n", FILE_APPEND);
	echo json_encode(['status' => "Connection error"]);
	die();
}

session_start();
?>