#!/usr/bin/env bash

if (forever list | grep csdesign); then
    forever stop csdesign;
fi;
forever start -a --uid csdesign back/app.js