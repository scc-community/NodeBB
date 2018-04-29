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

 Date: 29/04/2018 15:29:32
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
  `uid` mediumint(9) NOT NULL,
  `username` varchar(20) NOT NULL,
  `reward-type` enum('1','2','3','4','5','999') NOT NULL,
  `desc` varchar(40) NOT NULL,
  `date-issued` datetime NOT NULL,
  `scc-setted` mediumint(8) unsigned NOT NULL,
  `memo` varchar(40) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL,
  `version` char(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='类型:邀请好友/文章奖励/源码奖励/签到/打赏/其它  reward-type:''1'',''2'',''3'',''4'',''5'',''999''';

-- ----------------------------
-- Table structure for post-rewareds
-- ----------------------------
DROP TABLE IF EXISTS `post-rewareds`;
CREATE TABLE `post-rewareds` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uid` mediumint(9) NOT NULL,
  `post-id` bigint(20) unsigned NOT NULL,
  `post-title` varchar(50) NOT NULL,
  `post-type` enum('1','2','3') NOT NULL DEFAULT '1',
  `post-words` mediumint(8) unsigned NOT NULL,
  `upvote` mediumint(8) unsigned NOT NULL,
  `date-posted` datetime NOT NULL,
  `date-created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `scc-autoed` mediumint(8) unsigned NOT NULL,
  `scc-setted` mediumint(8) unsigned DEFAULT NULL,
  `scc-issued` mediumint(8) unsigned DEFAULT NULL,
  `date-issued` datetime DEFAULT NULL,
  `memo` varchar(40) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL,
  `version` char(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='1 文章类型:原创/翻译/转载  post-type:''1'',''2'',''3''';

-- ----------------------------
-- Table structure for reward-txs
-- ----------------------------
DROP TABLE IF EXISTS `reward-txs`;
CREATE TABLE `reward-txs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uid` mediumint(20) unsigned NOT NULL,
  `reward-src` enum('1','2') NOT NULL,
  `reward-src-id` bigint(20) NOT NULL,
  `trade-type` enum('1','2') NOT NULL DEFAULT '1',
  `reward-type` enum('1','2','3','4','5','999') NOT NULL,
  `desc` varchar(40) NOT NULL,
  `tx-id` varchar(20) NOT NULL,
  `date-issued` datetime NOT NULL,
  `memo` varchar(40) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL,
  `version` char(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='1 类别:收入/支出  trade-type:’1’,’2’\n2 类型:邀请好友/文章奖励/源码奖励/签到/打赏/其它  reward-type:''1'',''2'',''3'',''4'',''5'',''999''\n3 奖励的来源表:文章奖励/人工奖励  reward-src:''1'',''2''';

SET FOREIGN_KEY_CHECKS = 1;
