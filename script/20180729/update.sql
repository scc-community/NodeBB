
USE scc;
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

BEGIN;
UPDATE task_category_items SET comment = '未发布::未发布' WHERE id = 151;
UPDATE task_category_items SET comment = '待领取::已发布' WHERE id = 152;
UPDATE task_category_items SET comment = '开发中::已领取' WHERE id = 153;
UPDATE task_category_items SET comment = '已提交::已提交' WHERE id = 154;
UPDATE task_category_items SET comment = '已结算::已结算' WHERE id = 155;
UPDATE task_category_items SET comment = '已完成::已完成' WHERE id = 156;
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;