ALTER TABLE `scc`.`manual_rewards` 
  CHANGE COLUMN version version mediumint(9) NOT NULL DEFAULT '0' COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  CHANGE COLUMN scc_setted scc_setted mediumint(9) NOT NULL COMMENT '发放奖励';

ALTER TABLE `scc`.`reward_types` 
  CHANGE COLUMN version version mediumint(9) NOT NULL DEFAULT '0' COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库';

DELETE * FROM manual_rewards;

BEGIN;
DELETE * FROM reward_types;
INSERT INTO `reward_types` VALUES (1, 'register', 'register', '[[rewardType:register]]', '注册', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `reward_types` VALUES (2, 'register', 'register_invited', '[[rewardType:register_invited]]', '被邀请注册', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `reward_types` VALUES (3, 'register', 'invite_friend', '[[rewardType:invited_friend]]', '邀请好友注册', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `reward_types` VALUES (4, 'register', 'invite_extra', '[[rewardType:invite_extra]]', '推10以下送90/人;以10人为梯度,达梯度值额外送(10人*90*比例);每梯度的比例比上一梯度递增10%;比例到100%(70人)不再增加;更多额外送(人数-70)*90', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `reward_types` VALUES (51, 'topic', 'original', '[[rewardType:original]]', '原创:60SCC/500字，超出不满500部分按500字计算 / 文章每获得一个赞奖励1SCC', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `reward_types` VALUES (52, 'topic', 'translation', '[[rewardType:translation]]', '翻译:60SCC/500字，超出不满500部分按500字计算 / 文章每获得一个赞奖励1SCC', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `reward_types` VALUES (53, 'topic', 'reprint', '[[rewardType:reprint]]', '转载:每转载一篇文章奖励30SC', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `reward_types` VALUES (999, 'other', 'other', '[[rewardType:other]]', '其它', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
COMMIT;

ALTER TABLE `scc`.`topic_rewards` 
  CHANGE COLUMN version version mediumint(9) NOT NULL DEFAULT '0' COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库';

DROP TABLE IF EXISTS `tx_log`;
CREATE TABLE `tx_log` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `event` varchar(40) NOT NULL COMMENT '事件（可扩充）,如邮件验证注册奖励/人工奖励/文章奖励',
  `group_id` varchar(40) NOT NULL COMMENT '事务组ID,用于同一笔事务的交易分组',
  `method` enum('1','2','3') NOT NULL COMMENT '方法,1:begin/3:end/2:record',
  `txs_id` bigint(20) DEFAULT NULL COMMENT '交易表id',
  `data` varchar(4096) DEFAULT NULL COMMENT '自定义数据',
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  `last_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  `version` mediumint(10) NOT NULL DEFAULT '0' COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  PRIMARY KEY (`id`),
  KEY `index_groupid` (`group_id`) USING HASH,
  KEY `index_txsid` (`txs_id`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=223 DEFAULT CHARSET=utf8 COMMENT='交易日志表';

ALTER TABLE `scc`.`txs` 
  ADD CONSTRAINT fk_users_txs_transaction_uid FOREIGN KEY(transaction_uid) REFERENCES `scc`.`users`(uid), 
  ADD INDEX fk_users_txs_transaction_uid (transaction_uid), 
  CHANGE COLUMN version version mediumint(9) NOT NULL DEFAULT '0' COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库', 
  CHANGE COLUMN content content varchar(100) NULL COMMENT '内容,数据来源人工奖励/文章奖励';

ALTER TABLE `scc`.`users` 
  CHANGE COLUMN version version mediumint(9) NOT NULL DEFAULT '0' COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库';