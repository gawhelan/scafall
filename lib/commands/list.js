var exec = require('child_process').execSync;
var path = require('path');

var log = require('../log');
var packages = require('../packages');

module.exports = function () {
    var allPackages;
    var generators = [];
    var scafallPath = path.dirname(path.dirname(__dirname));

    log.info('Finding installed generators...');

    try {
        allPackages = JSON.parse(exec(
            'cd ' + scafallPath + ' && npm ls --depth=0 --json'
        ));
    } catch (err) {
        log.error(err.message);
    }

    if (!allPackages || !allPackages.dependencies) {
        log.error('Could not list packages.');
        process.exit(1);
    }

    allPackages = allPackages.dependencies;

    generators = Object.keys(allPackages).filter(function (name) {
        return packages.isPackageName(name);
    }).map(function (name) {
        return {
            name: name,
            version: allPackages[name].version,
        };
    });

    if (generators.length === 0) {
        log.info('No generators found.');
    } else {
        generators.forEach(function (g) {
        log.info('  - ' + packages.getGeneratorName(g.name) +
            ' (' + g.name + '@' + g.version + ')');
        });
    }
};
