#!/usr/bin/env node

var exec = require('child_process').execSync;

var app = require('commander');

var log = require('../lib/log');

var allPackages = [];
var generators = [];
var nameRegex = /^scafall-/;

app.usage('')
    .parse(process.argv);

log.info('Finding installed generators...');

try {
    allPackages = JSON.parse(exec('npm ls --global --depth=0 --json'));
} catch (err) {
    log.error(err.message);
}

if (!allPackages || !allPackages.dependencies) {
    log.error('Could not list packages.');
    process.exit(1);
}

allPackages = allPackages.dependencies;

generators = Object.keys(allPackages).filter(function (name) {
    return nameRegex.test(name);
}).map(function (name) {
    return {
        name: name,
        version: allPackages[name].version,
    };
});

if (generators.length === 0) {
    log.info('   No generators found.');
} else {
    generators.forEach(function (g) {
    log.info('    ' + g.name.replace(nameRegex, '') +
        ' (' + g.name + '@' + g.version + ')');
    });
}
