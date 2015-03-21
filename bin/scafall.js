#!/usr/bin/env node

var app = require('commander');

app
    .version(require('../package.json').version)
    .command('init <template>', 'Initialize a new project.')
    .command('ls', 'List all installed generators.')
    .parse(process.argv)
;
