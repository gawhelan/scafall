var exec = require('child_process').exec;
var byline = require('byline');

var log = require('../log');

var namePrefix = 'scafall-';

module.exports = function (generator) {
    var packageName;
    var child;

    log.info('Installing ' + generator + ' generator...');

    packageName = namePrefix + generator;

    child = exec('npm i -g ' + packageName);

    byline(child.stdout).on('data', function (line) {
        console.log('[npm]     ' + line);
    });

    byline(child.stderr).on('data', function (line) {
        console.error('[npm]     ' + line);
    });

    child.on('exit', function (code) {
        if (code !== 0) {
            log.error('Could not install ' + generator + ' generator.');
        } else {
            log.info(generator + ' generator installed.');
        }
    });
};
