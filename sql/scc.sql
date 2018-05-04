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
  `desc` varchar(40) NOT NULL,
  `date_issued` datetime NOT NULL,
  `scc_setted` mediumint(8) NOT NULL,
  `memo` varchar(40) NOT NULL,
  `publish_id` mediumint(9) unsigned NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_updated` datetime DEFAULT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `version` char(10) DEFAULT NOT NULL '0',
  PRIMARY KEY (`id`),
  KEY `fk_users_manual_rewards_uid` (`uid`),
  KEY `fk_reward_types_manual_rewards_reward_type` (`reward_type`),
  KEY `fk_users_manual_rewards_publish_id` (`publish_id`),
  CONSTRAINT `fk_reward_types_manual_rewards_reward_type` FOREIGN KEY (`reward_type`) REFERENCES `reward_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_users_manual_rewards_publish_id` FOREIGN KEY (`publish_id`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_users_manual_rewards_uid` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='手动奖励表';

-- ----------------------------
-- Table structure for post-rewards
-- ----------------------------
DROP TABLE IF EXISTS `post_rewards`;
CREATE TABLE `post_rewards` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uid` mediumint(9) unsigned NOT NULL,
  `reward_type` smallint(5) unsigned NOT NULL,
  `post_id` bigint(20) unsigned NOT NULL,
  `post_category` smallint(6) NOT NULL,
  `post_title` varchar(50) NOT NULL,
  `post_link` varchar(512) NOT NULL,
  `post_words_count` mediumint(8) unsigned NOT NULL,
  `post_upvotes_count` mediumint(8) unsigned NOT NULL,
  `date_posted` datetime NOT NULL,
  `scc_autoed` mediumint(8) NOT NULL,
  `scc_setted` mediumint(8) DEFAULT NULL,
  `scc_issued` mediumint(8) DEFAULT NULL,
  `date_issued` datetime DEFAULT NULL,
  `memo` varchar(40) DEFAULT NULL,
  `publish_id` mediumint(9) unsigned NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_updated` datetime DEFAULT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `version` char(10) DEFAULT NOT NULL '0',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `index_post_id` (`post_id`) USING HASH,
  KEY `fk_users_post_rewards_uid` (`uid`),
  KEY `fk_reward_types_post_rewards_reward_type` (`reward_type`),
  KEY `fk_users_post_rewards_publish_id` (`publish_id`),
  CONSTRAINT `fk_reward_types_post_rewards_reward_type` FOREIGN KEY (`reward_type`) REFERENCES `reward_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_users_post_rewards_publish_id` FOREIGN KEY (`publish_id`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_users_post_rewards_uid` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='文章奖励表';

-- ----------------------------
-- Table structure for reward-types
-- ----------------------------
DROP TABLE IF EXISTS `reward_types`;
CREATE TABLE `reward_types` (
  `id` smallint(5) unsigned NOT NULL,
  `category` varchar(20) NOT NULL,
  `item` varchar(20) NOT NULL,
  `content` varchar(40) DEFAULT NOT NULL,
  `scc` varchar(2048) NOT NULL DEFAULT '["return 0;"]',
  `comment` varchar(512) DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_updated` datetime DEFAULT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `version` char(10) DEFAULT NOT NULL '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='奖励类型表';

-- ----------------------------
-- Records of reward-types
-- ----------------------------
BEGIN;
INSERT INTO `users` VALUES (1, 0, '2018-05-02 00:02:02', '2018-05-02 00:02:02', '0');

INSERT INTO `reward_types` VALUES (1, 'register', 'register', '[[rewardType:register]]', 'function () {return 300;}', '注册');
INSERT INTO `reward_types` VALUES (2, 'register', 'register_invited', '[[rewardType:register_invited]]', 'function () {return 30;}', '被邀请注册');
INSERT INTO `reward_types` VALUES (3, 'register', 'invite_friend', '[[rewardType:invited_friend]]', 'function () {return 90;}', '邀请好友注册');
INSERT INTO `reward_types` VALUES (4, 'post', 'orinial', '[[rewardType:orinial]]', 'function () {return 0;}', '原创:60SCC/500字，超出不满500部分按500字计算 / 文章每获得一个赞奖励1SCC');
INSERT INTO `reward_types` VALUES (5, 'post', 'translation', '[[rewardType:translation]]', 'function () {return 0;}', '翻译:60SCC/500字，超出不满500部分按500字计算 / 文章每获得一个赞奖励1SCC');
INSERT INTO `reward_types` VALUES (6, 'post', 'reprint', '[[rewardType:reprint]]', 'function () {return 0;}', '转载:每转载一篇文章奖励30SC');
INSERT INTO `reward_types` VALUES (999, 'other', 'other', '[[rewardType:other]]', 'function () {return 0;}', '其它');
COMMIT;

-- ----------------------------
-- Table structure for txs
-- ----------------------------
DROP TABLE IF EXISTS `txs`;
CREATE TABLE `txs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uid` mediumint(20) unsigned NOT NULL,
  `publish_id` mediumint(8) unsigned NOT NULL,
  `transaction_type` enum('1','2') NOT NULL,
  `tx_no` varchar(20) NOT NULL,
  `reward_type` smallint(5) unsigned NOT NULL,
  `date_issued` datetime NOT NULL,
  `scc` mediumint(9) NOT NULL,
  `desc` varchar(40) NOT NULL,
  `memo` varchar(40) DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_updated` datetime DEFAULT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `version` char(10) DEFAULT NOT NULL '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_tx_no` (`tx_no`) USING HASH,
  KEY `fk_users_txs_uid` (`uid`),
  KEY `fk_reward_types_txs_reward_type` (`reward_type`),
  KEY `fk_users_txs_publish_id` (`publish_id`),
  CONSTRAINT `fk_reward_types_txs_reward_type` FOREIGN KEY (`reward_type`) REFERENCES `reward_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_users_txs_publish_id` FOREIGN KEY (`publish_id`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_users_txs_uid` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户收支明细表\n1 类别:收入/支出 transaction_type:’1’,’2’ ';

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` mediumint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uid` mediumint(20) unsigned NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_updated` datetime DEFAULT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `version` char(10) DEFAULT NOT NULL '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_uid` (`uid`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户表';

SET FOREIGN_KEY_CHECKS = 1;
