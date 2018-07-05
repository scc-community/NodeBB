#!/bin/bash
set -ev

curdir=$(cd "$(dirname "$0")"; pwd)
echo $curdir
mysql -hlocalhost -uscc -p scc< $curdir/update.sql
node $curdir/fix-rewardcheck.js

