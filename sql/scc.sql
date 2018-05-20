/*
 Navicat Premium Data Transfer

 Source Server         : 127.0.0.1
 Source Server Type    : MySQL
 Source Server Version : 50722
 Source Host           : localhost:3306
 Source Schema         : scc

 Target Server Type    : MySQL
 Target Server Version : 50722
 File Encoding         : 65001

 Date: 16/05/2018 11:14:00
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for manual_rewards
-- ----------------------------
DROP TABLE IF EXISTS `manual_rewards`;
CREATE TABLE `manual_rewards` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uid` mediumint(9) unsigned NOT NULL COMMENT '用户ID',
  `reward_type` smallint(5) unsigned NOT NULL COMMENT '奖励类型ID，外键关联',
  `content` varchar(40) NOT NULL COMMENT '奖励内容，如项目名/文章名/源码号等',
  `date_issued` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '奖励发放日期',
  `scc_setted` mediumint(8) NOT NULL COMMENT '奖励发放日期',
  `memo` varchar(40) DEFAULT NULL COMMENT '奖励备注',
  `publish_uid` mediumint(9) unsigned NOT NULL COMMENT '发布管理员用户ID，外键关联',
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  `last_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  `version` char(10) NOT NULL DEFAULT '0' COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  PRIMARY KEY (`id`),
  KEY `fk_users_manual_rewards_uid` (`uid`),
  KEY `fk_reward_types_manual_rewards_reward_type` (`reward_type`),
  KEY `fk_users_manual_rewards_publish_uid` (`publish_uid`),
  CONSTRAINT `fk_reward_types_manual_rewards_reward_type` FOREIGN KEY (`reward_type`) REFERENCES `reward_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_users_manual_rewards_publish_uid` FOREIGN KEY (`publish_uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_users_manual_rewards_uid` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='手动奖励表';

-- ----------------------------
-- Table structure for reward_types
-- ----------------------------
DROP TABLE IF EXISTS `reward_types`;
CREATE TABLE `reward_types` (
  `id` smallint(5) unsigned NOT NULL,
  `category` varchar(20) NOT NULL COMMENT '奖励分类',
  `item` varchar(20) NOT NULL COMMENT '奖励项目',
  `content` varchar(40) NOT NULL COMMENT '奖励内容',
  `comment` varchar(512) DEFAULT NULL COMMENT '内容注释',
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  `last_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  `version` char(10) NOT NULL DEFAULT '0' COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_cagegory_item` (`category`,`item`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='奖励类型表';

-- ----------------------------
-- Records of reward_types
-- ----------------------------
BEGIN;
INSERT INTO `reward_types` VALUES (1, 'register', 'register', '[[rewardType:register]]', '注册', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `reward_types` VALUES (2, 'register', 'register_invited', '[[rewardType:register_invited]]', '被邀请注册', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `reward_types` VALUES (3, 'register', 'invite_friend', '[[rewardType:invited_friend]]', '邀请好友注册', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `reward_types` VALUES (4, 'register', 'invite_extra', '[[rewardType:invite_extra]]', '推10以下送90/人;以10人为梯度,达梯度值额外送(10人*90*比例);每梯度的比例比上一梯度递增10%;比例到100%(70人)不再增加;更多额外送(人数-70)*90', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `reward_types` VALUES (5, 'topic', 'original', '[[rewardType:original]]', '原创:60SCC/500字，超出不满500部分按500字计算 / 文章每获得一个赞奖励1SCC', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `reward_types` VALUES (6, 'topic', 'translation', '[[rewardType:translation]]', '翻译:60SCC/500字，超出不满500部分按500字计算 / 文章每获得一个赞奖励1SCC', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `reward_types` VALUES (7, 'topic', 'reprint', '[[rewardType:reprint]]', '转载:每转载一篇文章奖励30SC', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `reward_types` VALUES (999, 'other', 'other', '[[rewardType:other]]', '其它', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
COMMIT;

-- ----------------------------
-- Table structure for topic_rewards
-- ----------------------------
DROP TABLE IF EXISTS `topic_rewards`;
CREATE TABLE `topic_rewards` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uid` mediumint(9) unsigned NOT NULL COMMENT '用户ID，外键关联',
  `status` enum('1','2','3') NOT NULL DEFAULT '1' COMMENT '1:未发放;2:已发放;3:已移除',
  `reward_type` smallint(5) unsigned NOT NULL COMMENT '奖励类型ID，外键关联',
  `topic_id` bigint(20) unsigned NOT NULL COMMENT '文章ID，数据来源NOSQL',
  `topic_category` smallint(6) NOT NULL COMMENT '文章分类ID，数据来源NOSQL',
  `topic_title` varchar(100) NOT NULL COMMENT '文章标题，数据来源NOSQL',
  `topic_words_count` mediumint(8) unsigned NOT NULL COMMENT '文章字数，数据来源NOSQL',
  `topic_upvotes_count` mediumint(8) unsigned NOT NULL COMMENT '点赞数，数据来源NOSQL',
  `date_posted` datetime NOT NULL COMMENT '文章提交日期，数据来源NOSQL',
  `scc_autoed` mediumint(8) NOT NULL COMMENT '统计计算SCC',
  `scc_setted` mediumint(8) COMMENT '人工修改SCC',
  `scc_issued` mediumint(8) NOT NULL COMMENT '实际发放SCC',
  `date_issued` datetime COMMENT '奖励发放日期',
  `memo` varchar(40) COMMENT '奖励移除/修改原因',
  `publish_uid` mediumint(9) unsigned NOT NULL COMMENT '发布管理员用户ID，外键关联',
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  `last_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  `version` char(10) NOT NULL DEFAULT '0' COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `index_topic_id` (`topic_id`) USING HASH,
  KEY `fk_users_topic_rewards_uid` (`uid`),
  KEY `fk_reward_types_topic_rewards_reward_type` (`reward_type`),
  KEY `fk_users_topic_rewards_publish_uid` (`publish_uid`),
  CONSTRAINT `fk_reward_types_topic_rewards_reward_type` FOREIGN KEY (`reward_type`) REFERENCES `reward_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_users_topic_rewards_publish_uid` FOREIGN KEY (`publish_uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_users_topic_rewards_uid` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主题奖励表';

-- ----------------------------
-- Table structure for txs
-- ----------------------------
DROP TABLE IF EXISTS `txs`;
CREATE TABLE `txs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uid` mediumint(9) unsigned NOT NULL COMMENT '用户ID，外键关联',
  `transaction_uid` mediumint(20) unsigned NOT NULL DEFAULT '0' COMMENT '交易用户ID，外键关联',
  `publish_uid` mediumint(8) unsigned NOT NULL COMMENT '发布管理员用户ID，外键关联',
  `transaction_type` enum('1','2') NOT NULL COMMENT '1:收入/2:支出',
  `tx_no` varchar(40) NOT NULL COMMENT '交易编号，同步至区块链系统',
  `reward_type` smallint(5) unsigned NOT NULL COMMENT '奖励类型ID，外键关联',
  `date_issued` datetime NOT NULL COMMENT '交易发放日期',
  `scc` mediumint(9) NOT NULL COMMENT '交易SCC',
  `content` varchar(100) NOT NULL COMMENT '内容,数据来源人工奖励/文章奖励',
  `memo` varchar(40) DEFAULT NULL COMMENT '备注,数据来源人工奖励/文章奖励',
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  `last_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  `version` char(10) NOT NULL DEFAULT '0' COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_tx_no` (`tx_no`) USING HASH,
  KEY `fk_users_txs_uid` (`uid`),
  KEY `fk_reward_types_txs_reward_type` (`reward_type`),
  KEY `fk_users_txs_publish_uid` (`publish_uid`),
  CONSTRAINT `fk_reward_types_txs_reward_type` FOREIGN KEY (`reward_type`) REFERENCES `reward_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_users_txs_transaction_uid` FOREIGN KEY (`transaction_uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_users_txs_publish_uid` FOREIGN KEY (`publish_uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_users_txs_uid` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='交易表';

-- ----------------------------
-- Table structure for tx_log
-- ----------------------------
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
  `version` char(10) NOT NULL DEFAULT '0' COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  PRIMARY KEY (`id`),
  KEY `index_txsid` (`txs_id`) USING HASH,
  KEY `index_groupid` (`group_id`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='交易日志表';

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` mediumint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uid` mediumint(9) unsigned NOT NULL COMMENT '用户ID',
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  `last_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  `version` char(10) NOT NULL DEFAULT '0' COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_uid` (`uid`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户表，数据来源NOSQL';

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO `users` VALUES (1, 0, '2018-01-01 00:00:00', '2018-01-01 00:00:00', '0');
INSERT INTO `users` VALUES (2, 1, '2018-01-01 00:00:00', '2018-01-01 00:00:00', '0');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
