#!/usr/bin/env node

var app = require('commander');

app.version(require('../package.json').version);

app.command('init <generator>')
    .description('Initialize a new project.')
    .action(require('../lib/commands/init'));

app.command('install <generator>')
    .alias('i')
    .description('Install a generator.')
    .action(require('../lib/commands/install'));

app.command('uninstall <generator>')
    .alias('rm')
    .description('Uninstall a generator.')
    .action(require('../lib/commands/uninstall'));

app.command('list')
    .alias('ls')
    .description('List all installed generators.')
    .action(require('../lib/commands/list'));

app.parse(process.argv);
