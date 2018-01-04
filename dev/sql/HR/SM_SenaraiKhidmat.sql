SELECT JSON_OBJECT(
	'data1', '1',
	'data2', 'PEGAWAI TEKNOLOGI MAKLUMAT',
	'data3', 'TETAP',
    'data4','F48',
    'data5','BAHAGIAN PENGURUSAN',
    'data6','01/12/2015',
    'data7','',
    'data8','2 Tahun 1 Bulan'
) obj_data
UNION
SELECT JSON_OBJECT(
	'data1', '2',
	'data2', 'PEGAWAI TEKNOLOGI MAKLUMAT',
	'data3', 'TETAP DAN BERPENCEN',
    'data4','F48',
    'data5','BAHAGIAN PENYELIDIKAN PUTRAJAYA',
    'data6','11/08/2014',
    'data7','30/11/2015',
    'data8','1 Tahun 3 Bulan'
)
