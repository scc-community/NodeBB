
USE scc;
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

BEGIN;
UPDATE reward_types SET id = 51 WHERE id = 5;
UPDATE reward_types SET id = 52 WHERE id = 6;
UPDATE reward_types SET id = 53 WHERE id = 7;
INSERT INTO `reward_types` VALUES (101, 'task', 'code_modules', '[[rewardType:code_modules]]', '代码模块奖励', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `reward_types` VALUES (102, 'task', 'project', '[[rewardType:project]]', '项目奖励', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
COMMIT;

-- ----------------------------
-- Table structure for task_category_items
-- ----------------------------
DROP TABLE IF EXISTS `task_category_items`;
CREATE TABLE `task_category_items` (
  `id` smallint(5) unsigned NOT NULL,
  `category` varchar(20) NOT NULL COMMENT '分类',
  `item` varchar(20) NOT NULL COMMENT '项目',
  `content` varchar(40) NOT NULL COMMENT '内容',
  `comment` varchar(512) COMMENT '内容注释',
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  `last_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  `version` mediumint(9) NOT NULL DEFAULT '0' COMMENT 'node-mysql扩展(必须)，主要用于迁移数据库',
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_categoryitem` (`category`,`item`,`content`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='任务类型表';

BEGIN;
INSERT INTO `task_category_items` VALUES (1, 'types', 'app', 'ios', 'ios', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `task_category_items` VALUES (2, 'types', 'app', 'android', 'android', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `task_category_items` VALUES (3, 'types', 'app', 'web', 'web', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');

INSERT INTO `task_category_items` VALUES (51, 'types', 'dev_language', 'h5', 'h5', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `task_category_items` VALUES (52, 'types', 'dev_language', 'java', 'java', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `task_category_items` VALUES (53, 'types', 'dev_language', 'c', 'c', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `task_category_items` VALUES (54, 'types', 'dev_language', 'c++', 'c++', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');

INSERT INTO `task_category_items` VALUES (101, 'statuses', 'project_status', '[[scc-taskdist:project-beginning]]', '开始', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `task_category_items` VALUES (102, 'statuses', 'project_status', '[[scc-taskdist:project-ended]]', '完成', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `task_category_items` VALUES (103, 'statuses', 'project_status', '[[scc-taskdist:project-balanced]]', '结算', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');

INSERT INTO `task_category_items` VALUES (151, 'statuses', 'code_module_status', '[[scc-taskdist:module-draft]]', '未发布', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `task_category_items` VALUES (152, 'statuses', 'code_module_status', '[[scc-taskdist:module-published]]', '发布', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `task_category_items` VALUES (153, 'statuses', 'code_module_status', '[[scc-taskdist:module-developing]]', '开发', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `task_category_items` VALUES (154, 'statuses', 'code_module_status', '[[scc-taskdist:module-submited]]', '提交', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `task_category_items` VALUES (155, 'statuses', 'code_module_status', '[[scc-taskdist:module-balanced]]', '结算', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
INSERT INTO `task_category_items` VALUES (156, 'statuses', 'code_module_status', '[[scc-taskdist:module-closed]]', '异常关闭', '2018-05-16 11:12:27', '2018-05-16 11:12:27', '0');
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
  `date_ended` datetime COMMENT '异常关闭日期',
  `title` varchar(80) NOT NULL COMMENT '标题',
  `codemodule_count` smallint(5) unsigned NOT NULL DEFAULT 0 COMMENT '代码模块数',
  `architect_count` smallint(5) unsigned NOT NULL DEFAULT 0 COMMENT '架构师数',
  `status` smallint(5) unsigned NOT NULL COMMENT '状态,外键关联',
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
  `scc` mediumint(9) NOT NULL COMMENT '交易SCC',
  `work_desc` varchar(256) COMMENT '工作描述',
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
  `scc` mediumint(9) NOT NULL COMMENT '交易SCC',
  `requirement_desc` varchar(256) COMMENT '模块需求描述',
  `date_published` datetime COMMENT '发布日期',
  `delivery_deadline` datetime NOT NULL COMMENT '交付截止日期',
  `date_cutoff` datetime NOT NULL COMMENT '结算日期',
  `date_upload` datetime COMMENT '模块上传日期',
  `date_download` datetime COMMENT '模块下载日期',
  `date_close` datetime COMMENT '任务异常关闭日期',
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
	`projects`.`date_ended` AS `p_date_ended`,
	`projects`.`title` AS `p_title`,
	`projects`.`codemodule_count` AS `p_codemodule_count`,
	`projects`.`architect_count` AS `p_architect_count`,
	`projects`.`status` AS `p_status`,
	`projects`.`date_created` AS `p_date_created`,
	`code_modules`.`publish_uid` AS `cm_publish_uid`,
	`code_modules`.`accept_uid` AS `cm_accept_uid`,
	`code_modules`.`scc` AS `cm_scc`,
	`code_modules`.`requirement_desc` AS `cm_requirement_desc`,
	`code_modules`.`date_published` AS `cm_date_published`,
	`code_modules`.`delivery_deadline` AS `cm_delivery_deadline`,
	`code_modules`.`date_cutoff` AS `cm_date_cutoff`,
	`code_modules`.`date_upload` AS `cm_date_upload`,
	`code_modules`.`date_download` AS `cm_date_download`,
	`code_modules`.`date_close` AS `cm_date_close`,
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