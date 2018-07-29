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

DROP DATABASE IF EXISTS scc;
CREATE DATABASE scc;
USE scc;

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
  `content` varchar(40) NOT NULL COMMENT '内容，如项目名/文章名/源码号等',
  `date_issued` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '奖励发放日期',
  `scc_setted` mediumint(9) NOT NULL COMMENT '奖励',
  `memo` varchar(40) DEFAULT NULL COMMENT '备注',
  `publish_uid` mediumint(9) unsigned NOT NULL COMMENT '发布管理员用户ID，外键关联',
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  `last_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  `version` mediumint(9) NOT NULL DEFAULT '0' COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
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
  `version` mediumint(9) NOT NULL DEFAULT '0' COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
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
INSERT INTO `reward_types` VALUES (51, 'topic', 'original', '[[rewardType:original]]', '原创:60SCC/500字，超出不满500部分按500字计算 / 文章每获得一个赞奖励1SCC', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `reward_types` VALUES (52, 'topic', 'translation', '[[rewardType:translation]]', '翻译:60SCC/500字，超出不满500部分按500字计算 / 文章每获得一个赞奖励1SCC', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `reward_types` VALUES (53, 'topic', 'reprint', '[[rewardType:reprint]]', '转载:每转载一篇文章奖励30SC', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `reward_types` VALUES (101, 'task', 'code_module', '[[rewardType:code_module]]', '代码模块奖励', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `reward_types` VALUES (102, 'task', 'project', '[[rewardType:project]]', '项目奖励', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
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
  `transaction_uid` mediumint(9) unsigned NOT NULL DEFAULT '0' COMMENT '交易用户ID，外键关联',
  `publish_uid` mediumint(8) unsigned NOT NULL COMMENT '发布管理员用户ID，外键关联',
  `transaction_type` enum('1','2') NOT NULL COMMENT '1:收入/2:支出',
  `tx_no` varchar(40) NOT NULL COMMENT '交易编号，同步至区块链系统',
  `reward_type` smallint(5) unsigned NOT NULL COMMENT '奖励类型ID，外键关联',
  `date_issued` datetime NOT NULL COMMENT '交易发放日期',
  `scc` mediumint(9) NOT NULL COMMENT '交易SCC',
  `content` varchar(100) COMMENT '内容,数据来源人工奖励/文章奖励',
  `memo` varchar(40) DEFAULT NULL COMMENT '备注,数据来源人工奖励/文章奖励',
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  `last_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  `version` mediumint(9) NOT NULL DEFAULT '0' COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
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
  `version` mediumint(9) NOT NULL DEFAULT '0' COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  PRIMARY KEY (`id`),
  KEY `index_txsid` (`txs_id`) USING HASH,
  KEY `index_groupid` (`group_id`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='交易日志表';

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` mediumint(9) unsigned NOT NULL AUTO_INCREMENT,
  `uid` mediumint(9) unsigned NOT NULL COMMENT '用户ID',
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  `last_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  `version` mediumint(9) NOT NULL DEFAULT '0' COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_uid` (`uid`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户表，数据来源NOSQL';

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO `users` VALUES (2, 1, '2018-01-01 00:00:00', '2018-01-01 00:00:00', '0');
COMMIT;


-- ----------------------------
-- Table structure for task_category_items
-- ----------------------------
DROP TABLE IF EXISTS `task_category_items`;
CREATE TABLE `task_category_items` (
  `id` smallint(5) unsigned NOT NULL,
  `category` varchar(20) NOT NULL COMMENT '分类',
  `item` varchar(20) NOT NULL COMMENT '项目',
  `content` varchar(128) NOT NULL COMMENT '内容',
  `comment` varchar(512) COMMENT '内容注释',
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  `last_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  `version` mediumint(9) NOT NULL DEFAULT '0' COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_categoryitem` (`category`,`item`,`content`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='任务类型表';

BEGIN;
INSERT INTO `task_category_items` VALUES (1, 'app', 'ios', 'ios', 'ios', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `task_category_items` VALUES (2, 'app', 'android', 'android', 'android', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `task_category_items` VALUES (3, 'app', 'web', 'web', 'web', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');

INSERT INTO `task_category_items` VALUES (51, 'dev_language', 'h5', 'h5', 'h5', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `task_category_items` VALUES (52, 'dev_language', 'java', 'java', 'java', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `task_category_items` VALUES (53, 'dev_language', 'c', 'c', 'c', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `task_category_items` VALUES (54, 'dev_language', 'c++', 'c++', 'c++', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');

INSERT INTO `task_category_items` VALUES (101, 'project_status', 'beginning', '[[scc-task/category-item:option.project-status.beginning]]', '开始', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `task_category_items` VALUES (102, 'project_status', 'ended', '[[scc-task/category-item:option.project-status.ended]]', '完成', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `task_category_items` VALUES (103, 'project_status', 'balanced', '[[scc-task/category-item:option.project-status.balanced]]', '结算', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');

INSERT INTO `task_category_items` VALUES (151, 'code_module_status', 'draft', '[[scc-task/category-item:option.code-module.draft]]', '未发布::未发布', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `task_category_items` VALUES (152, 'code_module_status', 'published', '[[scc-task/category-item:option.code-module.published]]', '待领取::已发布', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `task_category_items` VALUES (153, 'code_module_status', 'developing', '[[scc-task/category-item:option.code-module.developing]]', '开发中::已领取', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `task_category_items` VALUES (154, 'code_module_status', 'submited', '[[scc-task/category-item:option.code-module.submited]]', '已提交::已提交', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `task_category_items` VALUES (155, 'code_module_status', 'balanced', '[[scc-task/category-item:option.code-module.balanced]]', '已结算::已结算', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `task_category_items` VALUES (156, 'code_module_status', 'closed', '[[scc-task/category-item:option.code-module.closed]]', '已完成::已完成', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
COMMIT;

-- ----------------------------
-- Table structure for projects
-- ----------------------------
DROP TABLE IF EXISTS `projects`;
CREATE TABLE `projects` (
  `id` mediumint(9) unsigned NOT NULL AUTO_INCREMENT,
  `publish_uid` mediumint(9) unsigned NOT NULL COMMENT '发布者ID',
  `date_published` datetime NOT NULL COMMENT '发布日期',
  `delivery_deadline` datetime NOT NULL COMMENT '交付截止日期',
  `date_closed` datetime COMMENT '异常关闭日期',
  `date_cutoff` datetime COMMENT '结算日期',
  `title` varchar(80) NOT NULL COMMENT '标题',
  `description` varchar(80) NOT NULL COMMENT '描述',
  'codemodule_url' varchar(256) COMMENT '代码一键打包下载URL',
  `codemodule_count` smallint(5) unsigned NOT NULL DEFAULT 0 COMMENT '代码模块数',
  `architect_count` smallint(5) unsigned NOT NULL DEFAULT 0 COMMENT '架构师数',
  `status` smallint(5) unsigned NOT NULL COMMENT '状态,外键关联',
  `scc_sum` mediumint(9) unsigned NOT NULL DEFAULT 0 COMMENT 'SCC汇总，包括架构师和模块所需SCC',
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  `last_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  `version` mediumint(9) NOT NULL DEFAULT '0' COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  PRIMARY KEY (`id`),
  KEY `index_datepublished` (`date_published`),
  KEY `fk_users_uid_projects_publishuid` (`publish_uid`),
  KEY `fk_taskcategoryitems_id_projects_status` (`status`),
  CONSTRAINT `fk_users_uid_projects_publishuid` FOREIGN KEY (`publish_uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_taskcategoryitems_id_projects_status` FOREIGN KEY (`status`) REFERENCES `task_category_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='任务项目表';

-- ----------------------------
-- Table structure for project_architects
-- ----------------------------
DROP TABLE IF EXISTS `project_architects`;
CREATE TABLE `project_architects` (
  `id` mediumint(9) unsigned NOT NULL AUTO_INCREMENT,
  `p_id` mediumint(9) unsigned NOT NULL COMMENT '项目id,外键关联',
  `architect_uid` mediumint(9) unsigned NOT NULL COMMENT '架构师uid,外键关联',
  `scc` mediumint(9) NOT NULL DEFAULT 0 COMMENT '交易SCC',
  `work_desc` varchar(256) NOT NULL COMMENT '工作描述',
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  `last_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  `version` mediumint(9) NOT NULL DEFAULT '0' COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uindex_pid_architectuid` (`p_id`,`architect_uid`) USING HASH,
  KEY `fk_projects_id_pa_pid` (`p_id`),
  KEY `fk_cm_id_pa_auid` (`architect_uid`),
  CONSTRAINT `fk_projects_id_pa_pid` FOREIGN KEY (`p_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_cm_id_pa_auid` FOREIGN KEY (`architect_uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='项目-架构师关联表';

-- ----------------------------
-- Table structure for code_modules
-- ----------------------------
DROP TABLE IF EXISTS `code_modules`;
CREATE TABLE `code_modules` (
  `id` mediumint(9) unsigned NOT NULL AUTO_INCREMENT,
  `publish_uid` mediumint(9) unsigned NOT NULL COMMENT '发布者ID',
  `accept_uid` mediumint(9) unsigned NOT NULL COMMENT '接任务者ID',
  `title` varchar(80) NOT NULL COMMENT '标题',
  `scc` mediumint(9) NOT NULL DEFAULT 0 COMMENT '交易SCC',
  `requirement_desc` varchar(256) COMMENT '模块需求描述',
  `date_published` datetime COMMENT '发布日期',
  `delivery_deadline` datetime NOT NULL COMMENT '交付截止日期',
  `date_cutoff` datetime COMMENT '结算日期',
  `date_upload` datetime COMMENT '模块上传日期',
  `date_download` datetime COMMENT '模块下载日期',
  `date_closed` datetime COMMENT '异常关闭日期',
  `url` varchar(128) COMMENT '模块下载URL',
  `dev_language` varchar(256) NOT NULL COMMENT '开发语言(多选)',
  `app` varchar(256) NOT NULL COMMENT '客户端对象(多选)',
  `status` smallint(5) unsigned NOT NULL COMMENT '状态,外键关联',
  `memo` varchar(40) COMMENT '备注',
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  `last_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  `version` mediumint(9) NOT NULL DEFAULT '0' COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  PRIMARY KEY (`id`),
  KEY `index_datecreated` (`date_created`),
  KEY `index_title` (`title`),
  KEY `index_datepublished` (`date_published`),
  KEY `fk_users_uid_codemodules_publishuid` (`publish_uid`),
  KEY `fk_users_uid_codemodules_acceptuid` (`accept_uid`),
  KEY `fk_taskcategoryitems_id_codemodules_status` (`status`),
  CONSTRAINT `fk_users_uid_codemodules_publishuid` FOREIGN KEY (`publish_uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_users_uid_codemodules_acceptuid` FOREIGN KEY (`accept_uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_taskcategoryitems_id_codemodules_status` FOREIGN KEY (`status`) REFERENCES `task_category_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='代码模块表';

-- ----------------------------
-- Table structure for projects_code_modules
-- ----------------------------
DROP TABLE IF EXISTS `projects_code_modules`;
CREATE TABLE `projects_code_modules` (
  `id` mediumint(9) unsigned NOT NULL AUTO_INCREMENT,
  `p_id` mediumint(9) unsigned NOT NULL COMMENT '项目id,外键关联',
  `cm_id` mediumint(9) unsigned NOT NULL COMMENT '代码模块id,外键关联',
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  `last_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  `version` mediumint(9) NOT NULL DEFAULT '0' COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uindex_pid_cmid` (`p_id`,`cm_id`) USING HASH,
  KEY `fk_projects_id_pcm_pid` (`p_id`),
  KEY `fk_cm_id_pcm_cmid` (`cm_id`),
  CONSTRAINT `fk_projects_id_pcm_pid` FOREIGN KEY (`p_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_cm_id_pcm_cmid` FOREIGN KEY (`cm_id`) REFERENCES `code_modules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='项目-代码模块关联表';

-- ----------------------------
-- View structure for v_pcm
-- ----------------------------
DROP VIEW IF EXISTS `v_pcm`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY INVOKER VIEW 
`v_pcm` AS 
SELECT
	`projects_code_modules`.`id` AS `id`,
	`projects_code_modules`.`p_id` AS `p_id`,
	`projects_code_modules`.`cm_id` AS `cm_id`,
	`projects`.`publish_uid` AS `p_publish_uid`,
	`projects`.`date_published` AS `p_date_published`,
	`projects`.`delivery_deadline` AS `p_delivery_deadline`,
	`projects`.`date_closed` AS `p_date_closed`,
  `projects`.`date_cutoff` AS `p_date_cutoff`,
	`projects`.`title` AS `p_title`,
	`projects`.`description` AS `p_description`,
  `projects`.`codemodule_url` AS `p_codemodule_url`,
	`projects`.`codemodule_count` AS `p_codemodule_count`,
	`projects`.`architect_count` AS `p_architect_count`,
	`projects`.`status` AS `p_status`,
  `projects`.`scc_sum` AS `p_scc_sum`,
	`projects`.`date_created` AS `p_date_created`,
	`code_modules`.`publish_uid` AS `cm_publish_uid`,
	`code_modules`.`accept_uid` AS `cm_accept_uid`,
  `code_modules`.`title` AS `cm_title`,
	`code_modules`.`scc` AS `cm_scc`,
	`code_modules`.`requirement_desc` AS `cm_requirement_desc`,
	`code_modules`.`date_published` AS `cm_date_published`,
	`code_modules`.`delivery_deadline` AS `cm_delivery_deadline`,
	`code_modules`.`date_cutoff` AS `cm_date_cutoff`,
	`code_modules`.`date_upload` AS `cm_date_upload`,
	`code_modules`.`date_download` AS `cm_date_download`,
	`code_modules`.`date_closed` AS `cm_date_closed`,
	`code_modules`.`url` AS `cm_url`,
	`code_modules`.`dev_language` AS `cm_dev_language`,
	`code_modules`.`app` AS `cm_app`,
	`code_modules`.`status` AS `cm_status`,
	`code_modules`.`memo` AS `cm_memo`,
	`code_modules`.`date_created` AS `cm_date_created` 
FROM
	(
		( `projects_code_modules` JOIN `projects` ON ( ( `projects_code_modules`.`p_id` = `projects`.`id` ) ) )
	JOIN `code_modules` ON ( ( `projects_code_modules`.`cm_id` = `code_modules`.`id` ) ) 
	) WITH CASCADED CHECK OPTION;
  
SET FOREIGN_KEY_CHECKS = 1;
