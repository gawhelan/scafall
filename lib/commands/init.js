var log = require('../log');
var Generator = require('../generator');

module.exports = function (generatorName) {
    var generator;

    log.info('Running ' + generator + ' generator...');

    try {
        generator = new Generator(generatorName);
    } catch (err) {
        log.error(err);
        return;
    }

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
};
