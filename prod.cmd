@echo off
title SwitchMP Backend - Prod
set NODE_OPTIONS=--no-warnings
cd src
:restart
node server.js
goto :restart