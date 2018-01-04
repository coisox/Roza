SELECT JSON_OBJECT(
	'ROZA_ID', staff_id,
	'ROZA_TITLE', staff_data->>'$.name',
	'ROZA_DESC', CONCAT(staff_data->>'$.icno', ', ', staff_data->>'$.kementerian', ', ', staff_data->>'$.bahagian'),
	'ROZA_TIME', staff_timeupdate,
	'ROZA_UNREAD', 0
) data
FROM roza.sample_staff
ORDER BY staff_timeupdate