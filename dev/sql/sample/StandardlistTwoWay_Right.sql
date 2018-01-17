SELECT JSON_OBJECT(
	'ROZA_ID', staff_id,
	'ROZA_TITLE', staff_data->>'$.name',
	'ROZA_DESC', CONCAT(staff_data->>'$.position', ', ', staff_data->>'$.group', ', ', (SELECT lov_data->>'$.labelbm' state FROM sample_lov WHERE lov_category = 'state' AND lov_data->>'$.value' = staff_data->>'$.state')),
	'ROZA_IMAGE', CONCAT('dev/upload/sample/profilepic', staff_id, '.jpg')
)
FROM sample_staff
WHERE staff_data->>'$.qualified' IS NOT NULL
ORDER BY staff_timeupdate