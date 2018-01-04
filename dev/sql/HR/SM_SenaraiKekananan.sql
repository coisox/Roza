SELECT JSON_MERGE(
	staff_data,
    JSON_OBJECT('tlahirfmt', UPPER(DATE_FORMAT(STR_TO_DATE(staff_data->>'$.tlahir', '%d/%c/%Y'), '%d-%b-%y'))),
    JSON_OBJECT('sdatefmt', UPPER(DATE_FORMAT(STR_TO_DATE(staff_data->>'$.SDate', '%d/%c/%Y'), '%d-%b-%y')))
	)
FROM
	sample_staff
order by staff_data->>'$.no_bsk'