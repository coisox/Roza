SELECT JSON_OBJECT(
	'data1', '1',
	'data2', 'xyz',
	'data3', '06/12/2017',
	'data4', '06/12/2017',
	'data5', 'AGC',
	'data6', '08/12/2017',
	'data7', 'testing1'
)
UNION
SELECT JSON_OBJECT(
	'data1', '2',
	'data2', 'abc',
	'data3', '08/12/2017',
	'data4', '08/12/2017',
	'data5', 'AGC',
	'data6', '',
	'data7', 'testing2'
)