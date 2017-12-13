SELECT JSON_OBJECT(
	'ROZA_ID', staff_id,
	'ROZA_TITLE', staff_data->>'$.name',
	'ROZA_DESC', CONCAT(staff_data->>'$.position', ', ', staff_data->>'$.group', ', ', (SELECT lov_data->>'$.labelbm' state FROM sample_lov WHERE lov_category = 'state' AND lov_data->>'$.value' = staff_data->>'$.state')),
	'ROZA_TIME', staff_timeupdate,
	'ROZA_UNREAD', 0
)
FROM sample_staff
WHERE
	/*==================================================================================*/
	CASE WHEN 'state_contains' = ? THEN staff_data->>'$.state' LIKE CONCAT('%',?,'%') END
	CASE WHEN 'state_notcontains' = ? THEN staff_data->>'$.state' NOT LIKE CONCAT('%',?,'%') END
	CASE WHEN 'state_is' = ? THEN staff_data->>'$.state' = ? END
	CASE WHEN 'state_isnt' = ? THEN staff_data->>'$.state' <> ? END
	CASE WHEN 'state_begin' = ? THEN staff_data->>'$.state' LIKE CONCAT(?,'%') END
	CASE WHEN 'state_end' = ? THEN staff_data->>'$.state' LIKE CONCAT('%',?) END
	/*==================================================================================*/
	CASE WHEN 'position_contains' = ? THEN staff_data->>'$.position' LIKE CONCAT('%',?,'%') END
	CASE WHEN 'position_notcontains' = ? THEN staff_data->>'$.position' NOT LIKE CONCAT('%',?,'%') END
	CASE WHEN 'position_is' = ? THEN staff_data->>'$.position' = ? END
	CASE WHEN 'position_isnt' = ? THEN staff_data->>'$.position' <> ? END
	CASE WHEN 'position_begin' = ? THEN staff_data->>'$.position' LIKE CONCAT(?,'%') END
	CASE WHEN 'position_end' = ? THEN staff_data->>'$.position' LIKE CONCAT('%',?) END
	/*==================================================================================*/
	CASE WHEN 'dateappoint_contains' = ? THEN staff_data->>'$.dateappoint' LIKE CONCAT('%',?,'%') END
	CASE WHEN 'dateappoint_notcontains' = ? THEN staff_data->>'$.dateappoint' NOT LIKE CONCAT('%',?,'%') END
	CASE WHEN 'dateappoint_is' = ? THEN staff_data->>'$.dateappoint' = ? END
	CASE WHEN 'dateappoint_isnt' = ? THEN staff_data->>'$.dateappoint' <> ? END
	CASE WHEN 'dateappoint_begin' = ? THEN staff_data->>'$.dateappoint' >= STR_TO_DATE(?, '%d/%m/%y') END
	CASE WHEN 'dateappoint_end' = ? THEN staff_data->>'$.dateappoint' <= STR_TO_DATE(?, '%d/%m/%y') END
ORDER BY staff_timeupdate