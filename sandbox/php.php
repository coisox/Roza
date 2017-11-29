<?php
	$userinfo = "Name: <b>John Poul</b> <br> Title: <b>PHP Guru</b>{{A}}{{B}}{{C}}{{D}}";
	preg_match_all("/({{)(.*)(}})/U", $userinfo, $pat_array);

	for($i=0; $i<count($pat_array[0]); $i++) {
		echo $pat_array[2][$i] . "<br>";
	}
	
	echo "<br>=======================================================<br>";
	
	$userinfo = "Name: <b>John Poul</b> <br> Title: <b>PHP Guru</b>";
	preg_match_all ("/<b>(.*)<\/b>/U", $userinfo, $pat_array);

	for($i=0; $i<count($pat_array[0]); $i++) {
		echo $pat_array[0][$i] . "<br>";
	}
	
	echo "<br>=======================================================<br>";
	
	echo $_GET['ddddddddddd'];
	
	echo str_replace('{{B}}', "'".'Z'."'", 'AAA {{B}} AAA');
	
	echo "<br>=======================================================<br>";
	
	$userinfo = "ROZA_TIME FROM proto_task WHERE task_userid = rozaGetParam(globalUserId) ORDER BY task_timecreate";
	preg_match_all("/(rozaGetParam\()(.*)(\))/U", $userinfo, $pat_array);

	for($i=0; $i<count($pat_array[0]); $i++) {
		echo $pat_array[2][$i] . "<br>";
	}
	
	echo "<br>=======================================================<br>";
	
	$arr = [];
	array_push($arr, ['nama' => 'Aizal', 'umur' => 38]);
	print_r($arr);
	
	echo '<br>';
	
	$arr = [];
	$arr2 = [];
	$arr2['nama'] = 'Aizal';
	$arr2['umur'] = '38';
	array_push($arr, $arr2);
	print_r($arr);
	
	echo "<br>=======================================================<br>";
	
	echo count(null);
	
	echo "<br>=======================================================<br>";
	
	echo'ABC'[1];
	
	echo "<br>=======================================================<br>";
	
	$xxx = [];
	$xxx['nama'] = 'Aizal';
	$xxx['umur'] = '12';
	print_r(count($xxx));
	print_r($xxx[0]);
	print_r($xxx);
	
	echo "<br>=======================================================<br>";
	echo date_format(new DateTime(),"U");
	
?>