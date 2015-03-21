#!/usr/bin/env node

var app = require('commander');

app.version(require('../package.json').version)
    .command('init <template>', 'Initialize a new project.')
    .command('ls', 'List all installed generators.')
;

app.command('install <generator>')
    .alias('i')
    .description('Install a generator.')
    .action(require('../lib/commands/install'));


app.command('uninstall <generator>')
    .alias('rm')
    .description('Uninstall a generator.')
    .action(require('../lib/commands/uninstall'));

app.parse(process.argv);
