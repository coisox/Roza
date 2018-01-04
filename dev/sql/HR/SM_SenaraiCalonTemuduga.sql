SELECT JSON_OBJECT(
	'data1', '1',
	'data2', 'Aisy Iman',
	'data3', '901227035655',
    'data4', '3.5',
    'data5', 'Ya',
	'data6','Berjaya'
) obj
UNION
SELECT JSON_OBJECT(
	'data1', '2',
	'data2', 'Dhiya Ammara',
	'data3', '921123045262',
    'data4', '2.5',
    'data5', 'Ya',
	'data6','Tidak Berjaya'
)
UNION
SELECT JSON_OBJECT(
	'data1', '3',
	'data2', 'Muhammad Irsyad',
	'data3', '911123045577',
    'data4', '3.5',
    'data5', 'Tidak',
	'data6','Berjaya'
)