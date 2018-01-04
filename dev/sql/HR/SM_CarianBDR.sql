SELECT JSON_OBJECT(
	'data1', '1',
	'data2', 'Aizal',
	'data3', 'Pengurusan',
    'data4','2017/001',
    'data5','Lulus'
) obj_data
UNION
SELECT JSON_OBJECT(
	'data1', '2',
	'data2', 'Aizal',
	'data3', 'Pengurusan',
    'data4','2018/001',
    'data5',''
)
UNION
SELECT JSON_OBJECT(
	'data1', '3',
	'data2', 'Faezah',
	'data3', 'Penasihat',
    'data4','2017/001',
    'data5','Lulus'
)