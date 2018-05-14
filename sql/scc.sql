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

 Date: 30/04/2018 15:50:22
*/
DROP DATABASE IF EXISTS scc;
CREATE DATABASE scc;
USE scc;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for manual-rewards
-- ----------------------------
DROP TABLE IF EXISTS `manual_rewards`;
CREATE TABLE `manual_rewards` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uid` mediumint(9) unsigned NOT NULL,
  `reward_type` smallint(5) unsigned NOT NULL,
  `content` varchar(40) NOT NULL,
  `date_issued` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `scc_setted` mediumint(8) NOT NULL,
  `memo` varchar(40),
  `publish_uid` mediumint(9) unsigned NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `version` char(10)  NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_users_manual_rewards_uid` (`uid`),
  KEY `fk_reward_types_manual_rewards_reward_type` (`reward_type`),
  KEY `fk_users_manual_rewards_publish_uid` (`publish_uid`),
  CONSTRAINT `fk_reward_types_manual_rewards_reward_type` FOREIGN KEY (`reward_type`) REFERENCES `reward_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_users_manual_rewards_publish_uid` FOREIGN KEY (`publish_uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_users_manual_rewards_uid` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='手动奖励表';

-- ----------------------------
-- Table structure for topic-rewards
-- ----------------------------
DROP TABLE IF EXISTS `topic_rewards`;
CREATE TABLE `topic_rewards` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uid` mediumint(9) unsigned NOT NULL,
  `status` enum('1','2','3') NOT NULL DEFAULT '1',
  `reward_type` smallint(5) unsigned NOT NULL,
  `topic_id` bigint(20) unsigned NOT NULL,
  `topic_category` smallint(6) NOT NULL,
  `topic_title` varchar(100) NOT NULL,
  `topic_words_count` mediumint(8) unsigned NOT NULL,
  `topic_upvotes_count` mediumint(8) unsigned NOT NULL,
  `date_posted` datetime NOT NULL,
  `scc_autoed` mediumint(8) NOT NULL,
  `scc_setted` mediumint(8) DEFAULT NULL,
  `scc_issued` mediumint(8) DEFAULT NULL,
  `date_issued` datetime DEFAULT NULL,
  `memo` varchar(40) DEFAULT NULL,
  `publish_uid` mediumint(9) unsigned NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `version` char(10)  NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `index_topic_id` (`topic_id`) USING HASH,
  KEY `fk_users_topic_rewards_uid` (`uid`),
  KEY `fk_reward_types_topic_rewards_reward_type` (`reward_type`),
  KEY `fk_users_topic_rewards_publish_uid` (`publish_uid`),
  CONSTRAINT `fk_reward_types_topic_rewards_reward_type` FOREIGN KEY (`reward_type`) REFERENCES `reward_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_users_topic_rewards_publish_uid` FOREIGN KEY (`publish_uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_users_topic_rewards_uid` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主题奖励表: status(1:未发放;2:已发放;3:已移除)';

-- ----------------------------
-- Table structure for reward-types
-- ----------------------------
DROP TABLE IF EXISTS `reward_types`;
CREATE TABLE `reward_types` (
  `id` smallint(5) unsigned NOT NULL,
  `category` varchar(20) NOT NULL,
  `item` varchar(20) NOT NULL,
  `content` varchar(40) NOT NULL,
  `comment` varchar(512) DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `version` char(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_cagegory_item` (`category`,`item`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='奖励类型表';

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;CREATE TABLE `users` (
  `id` mediumint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uid` mediumint(20) unsigned NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `version` char(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_uid` (`uid`) USING HASH
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COMMENT = '用户表';

-- ----------------------------
-- Table structure for txs
-- ----------------------------
DROP TABLE IF EXISTS `txs`;
CREATE TABLE `txs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uid` mediumint(20) unsigned NOT NULL,
  `publish_uid` mediumint(8) unsigned NOT NULL,
  `transaction_type` enum('1','2') NOT NULL,
  `tx_no` varchar(40) NOT NULL,
  `reward_type` smallint(5) unsigned NOT NULL,
  `date_issued` datetime NOT NULL,
  `scc` mediumint(9) NOT NULL,
  `content` varchar(100) NOT NULL,
  `memo` varchar(40) DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `version` char(10)  NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_tx_no` (`tx_no`) USING HASH,
  KEY `fk_users_txs_uid` (`uid`),
  KEY `fk_reward_types_txs_reward_type` (`reward_type`),
  KEY `fk_users_txs_publish_uid` (`publish_uid`),
  CONSTRAINT `fk_reward_types_txs_reward_type` FOREIGN KEY (`reward_type`) REFERENCES `reward_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_users_txs_publish_uid` FOREIGN KEY (`publish_uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_users_txs_uid` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户收支明细表\n1 类别:收入/支出 transaction_type:’1’,’2’ ';

-- ----------------------------
-- Records of reward-types
-- ----------------------------
BEGIN;
INSERT INTO `users` VALUES (1, 0, '2018-01-01 00:00:00', '2018-01-01 00:00:00', '0');
INSERT INTO `users` VALUES (2, 1, '2018-01-01 00:00:00', '2018-01-01 00:00:00', '0');

INSERT INTO `reward_types` (id, category, item, content, comment) VALUES (1,'register', 'register', '[[rewardType:register]]', '注册');
INSERT INTO `reward_types` (id, category, item, content, comment) VALUES (2,'register', 'register_invited', '[[rewardType:register_invited]]', '被邀请注册');
INSERT INTO `reward_types` (id, category, item, content, comment) VALUES (3,'register', 'invite_friend', '[[rewardType:invited_friend]]', '邀请好友注册');
INSERT INTO `reward_types` (id, category, item, content, comment) VALUES (4,'register', 'invite_extra', '[[rewardType:invite_extra]]', '推10以下送90/人;以10人为梯度,达梯度值额外送(10人*90*比例);每梯度的比例比上一梯度递增10%;比例到100%(70人)不再增加;更多额外送(人数-70)*90');
INSERT INTO `reward_types` (id, category, item, content, comment) VALUES (5,'topic', 'original', '[[rewardType:original]]', '原创:60SCC/500字，超出不满500部分按500字计算 / 文章每获得一个赞奖励1SCC');
INSERT INTO `reward_types` (id, category, item, content, comment) VALUES (6,'topic', 'translation', '[[rewardType:translation]]', '翻译:60SCC/500字，超出不满500部分按500字计算 / 文章每获得一个赞奖励1SCC');
INSERT INTO `reward_types` (id, category, item, content, comment) VALUES (7,'topic', 'reprint', '[[rewardType:reprint]]', '转载:每转载一篇文章奖励30SC');
INSERT INTO `reward_types` (id, category, item, content, comment) VALUES (999, 'other', 'other', '[[rewardType:other]]', '其它');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;