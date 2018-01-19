SELECT JSON_OBJECT('ROZA_TITLE', 'Application', 'ROZA_TIME', NOW() - INTERVAL 1 DAY, 'data1', 'Pemohon bin Si Pulan', 'data2', DATE_FORMAT(NOW() - INTERVAL 1 DAY, '%d/%m/%Y'), 'data3', 'Sir, this is my application')
UNION
SELECT JSON_OBJECT('ROZA_TITLE', 'Recommend 1', 'ROZA_TIME', NOW(), 'data1', 'Penyokong 1 bin Si Pulan', 'data2', DATE_FORMAT(NOW(), '%d/%m/%Y'), 'data3', 'Sir, this is my application')
UNION
SELECT JSON_OBJECT('ROZA_TITLE', 'Recommend 2', 'ROZA_TIME', NULL)
UNION
SELECT JSON_OBJECT('ROZA_TITLE', 'Approval', 'ROZA_TIME', NULL)