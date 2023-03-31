#!/bin/sh
set -e
set -x

npm run build
scp dist/*.js knf01:/var/www/components/knf-window.js
