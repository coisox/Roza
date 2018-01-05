SELECT JSON_OBJECT('data1', '1', 'data2', DATE_FORMAT(SYSDATE(), '%d/%m/%Y'), 'data3', 'Cubaan 1') UNION
SELECT JSON_OBJECT('data1', '2', 'data2', DATE_FORMAT(SYSDATE(), '%d/%m/%Y'), 'data3', 'Cubaan 2') UNION
SELECT JSON_OBJECT('data1', '3', 'data2', DATE_FORMAT(SYSDATE(), '%d/%m/%Y'), 'data3', 'Cubaan 3')