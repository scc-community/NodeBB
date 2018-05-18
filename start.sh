#!/bin/bash

 VerifyReturnCode() {
 if [ $1 -ne 0 ];then
     echo "[$2] Fail."
     exit;
 else
     echo "[$2] Done."
 fi
 }

echo "[GIT]pulling"
git pull
VerifyReturnCode $? "GIT"

echo "[NODEBB] Upgrading"
./nodebb upgrade
VerifyReturnCode $? "NODEBB"

echo "[NODEBB] Stopping"
./nodebb stop
VerifyReturnCode $? "NODEBB"

echo "[NODEBB] Starting"
./nodebb start
VerifyReturnCode $? "NODEBB"

sleep 5

echo "[NODEBB] Checking"
result=$(ps -ef | grep -E "loader.js|app.js" | wc -l)
if [ $result != 3 ]; then
	echo "[NODEBB] fail to start!"
else 
	echo "[NODEBB] done"
fi

