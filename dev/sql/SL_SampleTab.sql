SELECT JSON_OBJECT(
	'ROZA_ID', 1,
	'ROZA_TITLE', 'Sample Tab 1',
	'ROZA_DESC', 'Click me for sample tab',
	'ROZA_TIME', SYSDATE(),
	'ROZA_UNREAD', 0
)
UNION
SELECT JSON_OBJECT(
	'ROZA_ID', 2,
	'ROZA_TITLE', 'Sample Tab 2',
	'ROZA_DESC', 'Click me for sample tab',
	'ROZA_TIME', SYSDATE(),
	'ROZA_UNREAD', 0
)
UNION
SELECT JSON_OBJECT(
	'ROZA_ID', 3,
	'ROZA_TITLE', 'Sample Tab 3',
	'ROZA_DESC', 'Click me for sample tab',
	'ROZA_TIME', SYSDATE(),
	'ROZA_UNREAD', 0
)