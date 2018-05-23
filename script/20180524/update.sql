ALTER TABLE `sc1`.`manual_rewards` 
  CHANGE COLUMN version version mediumint(9) NOT NULL DEFAULT '0' COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  CHANGE COLUMN scc_setted scc_setted mediumint(9) NOT NULL COMMENT '发放奖励';

ALTER TABLE `sc1`.`reward_types` 
  CHANGE COLUMN version version mediumint(9) NOT NULL DEFAULT '0' COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库';

ALTER TABLE `sc1`.`topic_rewards` 
  CHANGE COLUMN version version mediumint(9) NOT NULL DEFAULT '0' COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库';

ALTER TABLE `sc1`.`tx_log` 
  CHANGE COLUMN version version mediumint(9) NOT NULL DEFAULT '0' COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库';

ALTER TABLE `sc1`.`txs` 
  ADD CONSTRAINT fk_users_txs_transaction_uid FOREIGN KEY(transaction_uid) REFERENCES `sc1`.`users`(uid), 
  ADD INDEX fk_users_txs_transaction_uid (transaction_uid), 
  CHANGE COLUMN version version mediumint(9) NOT NULL DEFAULT '0' COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库', 
  CHANGE COLUMN content content varchar(100) NULL COMMENT '内容,数据来源人工奖励/文章奖励';

ALTER TABLE `sc1`.`users` 
  CHANGE COLUMN version version mediumint(9) NOT NULL DEFAULT '0' COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库';