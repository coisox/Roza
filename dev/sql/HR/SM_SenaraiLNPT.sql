SELECT JSON_OBJECT(
	'data1', '1',
	'data2', 'Sarjana',
	'data3', '3.66',
    'data4','2010',
    'data5','University Japan',
    'data6','Media And Governance (Cyber Informatics) - Multimedia Database',
    'data7','Jepun'
) obj_data
UNION
SELECT JSON_OBJECT(
	'data1', '2',
	'data2', 'Sarjana Muda',
	'data3', '3.8',
    'data4','1998',
    'data5','Universiti Utara Malaysia',
    'data6','Teknologi Maklumat',
    'data7','Malaysia'
)