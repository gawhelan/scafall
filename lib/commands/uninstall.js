var exec = require('child_process').exec;
var path = require('path');

var byline = require('byline');

var log = require('../log');
var packages = require('../packages');

module.exports = function (generator) {
    var packageName;
    var child;
    var scafallPath = path.dirname(path.dirname(__dirname));

    log.info('Uninstalling ' + generator + ' generator...');

    packageName = packages.getPackageName(generator);

    child = exec(
        'cd ' + scafallPath + ' && ' +
        'npm rm --save ' + packageName + ' >/dev/null'
    );

    byline(child.stdout).on('data', function (line) {
        console.log('[npm]     ' + line);
    });

    byline(child.stderr).on('data', function (line) {
        console.error('[npm]     ' + line);
    });

    child.on('exit', function (code) {
        if (code !== 0) {
            log.error('Could not uninstall '+ generator + ' generator.');
        } else {
            log.info(generator + ' generator uninstalled.');
        }
    });
};
