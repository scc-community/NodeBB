#!/bin/bash
set -ev

curdir=$(cd "$(dirname "$0")"; pwd)
echo $curdir
mysql -hlocalhost -uroot -p < $curdir/update.sql
node $curdir/fix-rewardcheck.js
redis-cli hincrby user:18 scctoken 200
redis-cli hincrby user:4 scctoken 10

