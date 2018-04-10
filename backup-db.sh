#!/bin/bash

BACKUP_DIR=/home/scc/backup/;
DATABASE_DIR=/var/lib/redis/;
DATABASE_NAME=dump.rdb;
DATE=$(date +%Y%m%d%H%M);

VerifyReturnCode() {
if [ $1 -ne 0 ];then
	echo "[$2] Fail."
	exit;
else 
	echo "[$2] Done."
fi
}

echo "[NODEBB] Stopping ....";
./nodebb stop
VerifyReturnCode $? "NODEBB";

echo "[REDIS] Stopping...";
sudo service redis-server stop
VerifyReturnCode $? "REDIS";

echo "[BACKUP] cp $DATABASE_NAME to $BACKUP_DIR";
sudo cp -p $DATABASE_DIR$DATABASE_NAME $BACKUP_DIR$DATABASE_NAME.$DATE
VerifyReturnCode $? "REDIS";

echo "[REDIS] Starting...";
sudo service redis-server start
VerifyReturnCode $? "REDIS";

echo "[NODEBB] Starting ....";
./nodebb start
VerifyReturnCode $? "NODEBB";

