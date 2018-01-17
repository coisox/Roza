SELECT JSON_OBJECT(
	'ROZA_ID', staff_id,
	'ROZA_TITLE', staff_data->>'$.name',
	'ROZA_DESC', CONCAT(staff_data->>'$.position', ', ', staff_data->>'$.group', ', ', (SELECT lov_data->>'$.labelbm' state FROM sample_lov WHERE lov_category = 'state' AND lov_data->>'$.value' = staff_data->>'$.state')),
	'ROZA_TIME', staff_timeupdate,
	'ROZA_UNREAD', 0,
	'state', staff_data->>'$.state',
	'position', staff_data->>'$.position',
	'dateappoint', staff_data->>'$.dateappoint'
)
FROM sample_staff
ORDER BY staff_timeupdate