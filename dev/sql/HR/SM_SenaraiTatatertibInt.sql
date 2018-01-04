SELECT JSON_OBJECT(
	'data1', '1',
	'data2', '15/11/2016',
	'data3', 'Lewat Hantar SKT',
    'data4','Denda'
) obj_data
UNION
SELECT JSON_OBJECT(
	'data1', '2',
	'data2', '10/08/2015',
	'data3', 'Lewat Hantar SKT',
    'data4','Amaran'
)
