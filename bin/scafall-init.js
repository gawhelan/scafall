#!/usr/bin/env node

var app = require('commander');

var log = require('../lib/log');
var Generator = require('../lib/generator');

var name;
var generator;


function getGeneratorName(app) {
    if (app.args.length === 0) {
        log.error('no generator specified.');
        app.help();
    } else if (app.args.length > 1) {
        log.error('too many arguments.');
        app.help();
    }

    return app.args[0];
}

app.usage('<generator>')
    .parse(process.argv);

name = getGeneratorName(app);

try {
    generator = new Generator(name);
} catch (err) {
    log.error(err);
    app.help();
}

log.info('Running ' + generator.name + ' generator...');
generator.prompt(function (err, context) {
    if (err) {
        log.error(err);
        return;
    }

    log.info('Running pre-init script...');
    generator.run('pre-init', function (err) {
        if (err) {
            log.error(err);
            return;
        }

        log.info('    ...done running pre-init script.');

        log.info('Copying files...');
        generator.copyFiles(function (err) {
            if (err) {
                log.error(err);
                return;
            }

            log.info('    ...done copying files.');

            log.info('Rendering templates...');
            generator.renderTemplates(function (err) {
                if (err) {
                    log.error(err);
                    return;
                }

                log.info('    ...done rendering templates.');

                log.info('Running post-init script...');
                generator.run('post-init', function(err) {
                    if (err) {
                        log.error(err);
                        return;
                    }

                    log.info('    ...done running post-init script.');
                    log.info('    ...done running ' + generator.name +
                        ' generator.');
                });
            });
        });
    });
});
