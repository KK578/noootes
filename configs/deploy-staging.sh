#!/bin/sh

firebase login --email $FIREBASE_EMAIL --password $FIREBASE_PASSWORD
firebase deploy --firebase "noootes-staging" | cat
