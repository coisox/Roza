SELECT JSON_MERGE(
	staff_data,
    JSON_OBJECT('fmttlahir', UPPER(DATE_FORMAT(STR_TO_DATE(staff_data->>'$.tlahir', '%d/%c/%Y'), '%d-%b-%y'))),    
    JSON_OBJECT('age', CONCAT( YEAR(CURDATE()) - YEAR(STR_TO_DATE(staff_data->>'$.tlahir', '%d/%c/%Y')) ," tahun"))
    )
FROM
	sample_staff
WHERE staff_id = ?