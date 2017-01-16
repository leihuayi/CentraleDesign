#!/usr/bin/env bash

./node_modules/apidoc/bin/apidoc -i ./back -o ./doc
if (forever list | grep csdesign); then
    forever stop csdesign;
fi;
forever start -a --uid csdesign back/app.js