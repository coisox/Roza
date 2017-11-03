<?php
	/*
	require_once('config.php');
	
	//Semua task dari setiap module, ada dalam table yang sama (eg proto_task)
	
	$sql = "
		SELECT
			task_id ITEM_ID,
			task_title ITEM_TITLE,
			task_desc ITEM_DESC,
			DATE_FORMAT(task_timecreate, '%d/%m/%y %h:%i%p') ITEM_TIME,
			task_unread ITEM_UNREAD,
			CONCAT('rozaExecuteJS(''Sumber Manusia'', ''UI_ProtoCuti.js?id=', task_id, ''')') ITEM_ONCLICK
		FROM proto_task
		WHERE task_userid = task_userid
		ORDER BY task_timecreate
	";
	
	$list = rozaGenerateList($sql);

	echo json_encode([
		'status' => 'ok',
		'title' => 'Senarai Tugasan',
		'list' => $list,
		'sort' => ['Masa','Tajuk'],
		'filter' => ['Baru','Selesai'],
		'fab' => 0
	]);
	*/
?>