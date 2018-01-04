SELECT JSON_OBJECT(
	'data1', '1',
	'data2', '123',
	'data3', '1/6/2017',
    'data4', '31/12/2017',
    'data5', 'Tidak Aktif'
) obj
UNION
SELECT JSON_OBJECT(
	'data1', '2',
	'data2', '456',
	'data3', '1/1/2018',
    'data4', '30/6/2018',
    'data5', 'Aktif'
)