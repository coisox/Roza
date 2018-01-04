SELECT JSON_OBJECT(
	'data1', '1',
	'data2', 'Ya',
	'data3', '2016'
) obj_data
UNION
SELECT JSON_OBJECT(
	'data1', '2',
	'data2', 'Ya',
	'data3', '2015'
)
