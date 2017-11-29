SELECT JSON_OBJECT(
	'data1', '1',
	'data2', SYSDATE(),
	'data3', 'Testing 123'
)
UNION
SELECT JSON_OBJECT(
	'data1', '2',
	'data2', SYSDATE(),
	'data3', 'Testing 456'
)
UNION
SELECT JSON_OBJECT(
	'data1', '3',
	'data2', SYSDATE(),
	'data3', 'Testing 789'
)