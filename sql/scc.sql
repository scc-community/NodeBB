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
DROP TABLE IF EXISTS `manual-rewards`;
CREATE TABLE `manual-rewards` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uid` mediumint(9) unsigned NOT NULL,
  `reward-type` smallint(5) unsigned NOT NULL,
  `desc` varchar(40) NOT NULL,
  `date-issued` datetime NOT NULL,
  `scc-setted` mediumint(8) NOT NULL,
  `memo` varchar(40) NOT NULL,
  `publish-id` mediumint(9) unsigned NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL,
  `version` char(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_users_manual-rewards_uid` (`uid`),
  KEY `fk_reward-types_manual-rewards_reward-type` (`reward-type`),
  KEY `fk_users_manual-rewards_publish-id` (`publish-id`),
  CONSTRAINT `fk_reward-types_manual-rewards_reward-type` FOREIGN KEY (`reward-type`) REFERENCES `reward-types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_users_manual-rewards_publish-id` FOREIGN KEY (`publish-id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_users_manual-rewards_uid` FOREIGN KEY (`uid`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='手动奖励表';

-- ----------------------------
-- Table structure for post-rewards
-- ----------------------------
DROP TABLE IF EXISTS `post-rewards`;
CREATE TABLE `post-rewards` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uid` mediumint(9) unsigned NOT NULL,
  `reward-type` smallint(5) unsigned NOT NULL,
  `post-id` bigint(20) unsigned NOT NULL,
  `post-category` smallint(6) NOT NULL,
  `post-title` varchar(50) NOT NULL,
  `post-link` varchar(512) NOT NULL,
  `post-words-count` mediumint(8) unsigned NOT NULL,
  `post-upvotes-count` mediumint(8) unsigned NOT NULL,
  `date-posted` datetime NOT NULL,
  `date-created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `scc-autoed` mediumint(8) NOT NULL,
  `scc-setted` mediumint(8) DEFAULT NULL,
  `scc-issued` mediumint(8) DEFAULT NULL,
  `date-issued` datetime DEFAULT NULL,
  `memo` varchar(40) DEFAULT NULL,
  `publish-id` mediumint(9) unsigned NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL,
  `version` char(10) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `index-post-id` (`post-id`) USING HASH,
  KEY `fk_users_post-rewards_uid` (`uid`),
  KEY `fk_reward-types-post-rewards_reward-type` (`reward-type`),
  KEY `fk_users_post-rewards_publish-id` (`publish-id`),
  CONSTRAINT `fk_reward-types-post-rewards_reward-type` FOREIGN KEY (`reward-type`) REFERENCES `reward-types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_users_post-rewards_publish-id` FOREIGN KEY (`publish-id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_users_post-rewards_uid` FOREIGN KEY (`uid`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='文章奖励表';

-- ----------------------------
-- Table structure for reward-types
-- ----------------------------
DROP TABLE IF EXISTS `reward-types`;
CREATE TABLE `reward-types` (
  `id` smallint(5) unsigned NOT NULL,
  `category` varchar(20) NOT NULL,
  `item` varchar(20) NOT NULL,
  `scc` varchar(2048) NOT NULL DEFAULT 'function () {return 0;}',
  `comment` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='奖励类型表';

-- ----------------------------
-- Records of reward-types
-- ----------------------------
BEGIN;
INSERT INTO `reward-types` VALUES (1, 'register', 'register', 'function () {return 300;}', '注册');
INSERT INTO `reward-types` VALUES (2, 'register', 'register-invited', 'function () {return 330;}', '被邀请注册');
INSERT INTO `reward-types` VALUES (3, 'register', 'invite-friend', 'function () {return 90;}', '邀请好友注册');
INSERT INTO `reward-types` VALUES (4, 'post', 'orinial', 'function () {return 0;}', '原创:60SCC/500字，超出不满500部分按500字计算 / 文章每获得一个赞奖励1SCC');
INSERT INTO `reward-types` VALUES (5, 'post', 'translation', 'function () {return 0;}', '翻译:60SCC/500字，超出不满500部分按500字计算 / 文章每获得一个赞奖励1SCC');
INSERT INTO `reward-types` VALUES (6, 'post', 'reprint', 'function () {return 0;}', '转载:每转载一篇文章奖励30SC');
INSERT INTO `reward-types` VALUES (999, 'other', 'other', 'function () {return 0;}', '其它');
COMMIT;

-- ----------------------------
-- Table structure for txs
-- ----------------------------
DROP TABLE IF EXISTS `txs`;
CREATE TABLE `txs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uid` mediumint(20) unsigned NOT NULL,
  `publish-id` mediumint(8) unsigned NOT NULL,
  `tx-type` enum('1','2') NOT NULL DEFAULT '1',
  `tx-no` varchar(20) NOT NULL,
  `reward-type` smallint(5) unsigned NOT NULL,
  `date-issued` datetime NOT NULL,
  `scc` mediumint(9) NOT NULL,
  `desc` varchar(40) NOT NULL,
  `memo` varchar(40) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL,
  `version` char(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `index-tx-no` (`tx-no`) USING HASH,
  KEY `fk_users_txs_uid` (`uid`),
  KEY `fk_reward-types-txs_reward-type` (`reward-type`),
  KEY `fk_users_txs_publish-id` (`publish-id`),
  CONSTRAINT `fk_reward-types-txs_reward-type` FOREIGN KEY (`reward-type`) REFERENCES `reward-types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_users_txs_publish-id` FOREIGN KEY (`publish-id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_users_txs_uid` FOREIGN KEY (`uid`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户收支明细表\n1 类别:收入/支出 transaction-type:’1’,’2’ ';

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` mediumint(20) unsigned NOT NULL,
  `username` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户表';

SET FOREIGN_KEY_CHECKS = 1;
