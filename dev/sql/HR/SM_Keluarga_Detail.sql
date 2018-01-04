select JSON_MERGE(obj_data, 
		  JSON_OBJECT('relID',lov_data->>'$.value')
		 )
from (SELECT JSON_OBJECT(
	'data1', '1',
	'data2', 'Noh Bin Bujang',
	'data3', 'Bapa',
    'data4','Pesara',
    'data5','05-03-1957',
    'data6','61 tahun'
)  obj_data FROM DUAL
UNION
SELECT JSON_OBJECT(
	'data1', '3',
	'data2', 'Idris Bin Kamil',
	'data3', 'Bapa',
    'data4','Sendiri',
    'data5','16-12-1964',
    'data6','59 tahun'
) obj_data FROM DUAL 
UNION
SELECT JSON_OBJECT(
	'data1', '1',
	'data2', 'Fatimah Binti Nordin',
	'data3', 'Ibu',
    'data4','Timbalan Pengarah',
    'data5','28-05-1963',
    'data6','55 tahun'
) obj_data FROM DUAL 
UNION
SELECT JSON_OBJECT(
	'data1', '3',
	'data2', 'Rosnani Binti Paleng',
	'data3', 'Ibu',
    'data4','Suri Rumah',
    'data5','30-07-1963',
    'data6','55 tahun'
) obj_data FROM DUAL 
UNION
SELECT JSON_OBJECT(
	'data1', '2',
	'data2', 'Ezryn Binti Ali',
	'data3', 'Anak Kandung',
    'data4','Pensyarah',
    'data5','14-11-1988',
    'data6','29 tahun'
) obj_data FROM DUAL
UNION
SELECT JSON_OBJECT(
	'data1', '2',
	'data2', 'Ali Bin Senin',
	'data3', 'Suami',
    'data4','Pengarah Kewangan',
    'data5','14-01-1960',
    'data6','58 tahun'
) obj_data FROM DUAL
) sample_data, sample_lov
where lov_data->>'$.labelbm' = obj_data->>'$.data3'
and obj_data->>'$.data2' = ?