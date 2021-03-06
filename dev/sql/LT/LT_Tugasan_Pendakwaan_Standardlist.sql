SELECT JSON_OBJECT(
	'ROZA_ID', 1,
	'ROZA_TITLE', 'KS-333-7567891',
	'ROZA_DESC', 'MAKLUMAT ASAS BELUM DIAGIHKAN',
	'ROZA_TIME', SYSDATE(),
	'PROCESS_ID', 'LT-KS',
	'MODULE_ID', 'A'
)
UNION
SELECT JSON_OBJECT(
	'ROZA_ID', 4,
	'ROZA_TITLE', 'KS-123-4567891',
	'ROZA_DESC', 'AGIHAN DAN KLASIFIKASI',
	'ROZA_TIME', SYSDATE(),
    'PROCESS_ID', 'LT-KS',
	'MODULE_ID', 'A'
)
UNION
SELECT JSON_OBJECT(
	'ROZA_ID', 2,
	'ROZA_TITLE', 'KS-778-9876543',
	'ROZA_DESC', 'PERINCIAN MAKLUMAT KERTAS SIASATAN DAN PENGHAKIMAN',
	'ROZA_TIME', SYSDATE(),
	'PROCESS_ID', 'LT-KS',
	'MODULE_ID', 'B'
)
UNION
SELECT JSON_OBJECT(
	'ROZA_ID', 3,
	'ROZA_TITLE', 'KS-321-7776543',
	'ROZA_DESC', 'PENGESAHAN PENUTUPAN FAIL',
	'ROZA_TIME', SYSDATE(),
	'PROCESS_ID', 'LT-KS',
	'MODULE_ID', 'B'
)
UNION
SELECT JSON_OBJECT(
	'ROZA_ID', 5,
	'ROZA_TITLE', 'JT-321-7776543',
	'ROZA_DESC', 'PENUTUPAN FAIL',
	'ROZA_TIME', SYSDATE(),
	'PROCESS_ID', 'LT-JT',
	'MODULE_ID', 'B'
)