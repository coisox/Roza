<?php

error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
//$conn = new mysqli('10.17.16.54', 'admin', 'Xs2mysql_admin', 'roza');
//$conn = new mysqli('ilims.ansi.com.my', 'admin', 'Xs2mysql_admin', 'roza');
$conn = new mysqli('127.0.0.1', 'root', '', 'roza');
date_default_timezone_set('Asia/Kuala_Lumpur');

if(mysqli_connect_errno()) {
	$timestamp = date("YmdHis");
	file_put_contents("error.log", $timestamp . "\t\t" . 'Connection error: '. mysqli_connect_errno() . "\n\n", FILE_APPEND);
	echo json_encode(['status' => "Connection error"]);
	die();
}

session_start();
?>