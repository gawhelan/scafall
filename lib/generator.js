var path = require('path');
var exec = require('child_process').execFile;

var fse = require('fs-extra');
var async = require('async');
var inquirer = require('inquirer');
var defaults = require('defaults');
var handlebars = require('handlebars');
var tmp = require('tmp');
var glob = require('glob');


function parseFileDescriptor(file, cwd) {
    var src, dest;
    var globbed = [];

    if (typeof file === 'string') {
        src = [file];
        dest = './';
    } else {
        if (typeof file.src === 'string') {
            src = [file.src];
        }

        if (file.cwd) {
            src = src.map(function (f) {
                return path.join(file.cwd, f);
            });
        }

        dest = file.dest ? file.dest : './';
    }

    src.forEach(function (f) {
        globbed = globbed.concat(glob.sync(f, {cwd: cwd}));
    });

    return {
        cwd: file.cwd || '.',
        src: globbed,
        dest: dest
    };
}

function Generator(name) {
    this.name = name;
    this.path = path.dirname(require.resolve('scafall-' + this.name));
    this.config = require('scafall-' + this.name) || {};
    this.context = {};
}

Generator.prototype.prompt = function (callback) {
    var self = this;
    var questions;
    var defaultAnswers = {};

    questions = this.config.questions;

    if (!questions) {
        callback(null, this.context);
        return;
    }

    if (!Array.isArray(questions)) {
        callback(new Error('"questions" must be an array'));
        return;
    }

    if (questions.length === 0) {
        callback(null, this.context);
        return;
    }

    questions.forEach(function (q) {
        if (q.name && q.default) {
            defaultAnswers[q.name] = q.default;
        }
    });

    inquirer.prompt(questions, function (answers) {
        self.context = defaults(answers, defaultAnswers);
        callback(null, self.context);
    });
};

Generator.prototype.run = function (name, callback) {
    var self = this;
    var scripts;
    var scriptPath;

    scripts = this.config.scripts;
    if (!scripts) {
        callback(null);
        return;
    }

    if (typeof scripts !== 'object') {
        callback(new Error('"scripts" must be an object'));
        return;
    }

    scriptPath = scripts[name];

    if (!scriptPath) {
        callback(null);
        return;
    }

    scriptPath = path.resolve(this.path, scriptPath);
    fse.readFile(scriptPath, function (err, data) {
        var content;
        var opts;

        if (err) {
            callback(err);
            return;
        }

        content = handlebars.compile(data.toString())(self.context);

        opts = {prefix: name + '-', dir: process.cwd()};
        tmp.file(opts, function (err, path) {
            if (err) {
                callback(err);
                return;
            }

            fse.writeFile(path, content, function (err) {
                var child;

                if (err) {
                    callback(err);
                    return;
                }

                child = exec('sh', [path], function (err) {
                    callback(err);
                });

                child.stdout.pipe(process.stdout);
                child.stderr.pipe(process.stderr);
            });
        });
    });
};

Generator.prototype.copyFiles = function (callback) {
    var self = this;
    var files;
    var tasks = [];

    files = this.config.staticFiles;
    if (!files) {
        callback(null);
        return;
    }

    if (!Array.isArray(files)) {
        callback(new Error('"copyFiles" must be an array'));
        return;
    }

    if (files.length === 0) {
        callback(null);
        return;
    }

    files.forEach(function (file) {
        file = parseFileDescriptor(file, self.path);

        file.src.forEach(function (src) {
            var dest = file.dest;

            if (dest[dest.length - 1] === '/') {
                dest = path.join(dest, path.relative(file.cwd, src));
            }

            tasks.push({src: src, dest: dest});
        });
    });

    async.eachSeries(tasks, function (t, done) {
        var src, dest;

        console.log('    ' + t.src + ' --> ' + t.dest);

        src = path.resolve(self.path, t.src);
        dest = path.resolve(process.cwd(), t.dest);
        fse.copy(src, dest, done);
    }, callback);
};

Generator.prototype.renderTemplates = function (callback) {
    var self = this;
    var files;
    var tasks = [];

    files = this.config.templateFiles;
    if (!files) {
        callback(null);
        return;
    }

    if (!Array.isArray(files)) {
        callback(new Error('"templateFiles" must be an array'));
        return;
    }

    if (files.length === 0) {
        callback(null);
        return;
    }

    files.forEach(function (file) {
        file = parseFileDescriptor(file, self.path);

        file.src.forEach(function (src) {
            var dest = file.dest;

            if (dest[dest.length - 1] === '/') {
                dest = path.join(dest, path.relative(file.cwd, src));
            }

            tasks.push({src: src, dest: dest});
        });
    });

    async.eachSeries(tasks, function (t, done) {
        var src, dest;

        console.log('    ' + t.src + ' --> ' + t.dest);

        src = path.resolve(self.path, t.src);
        dest = path.resolve(process.cwd(), t.dest);

        fse.readFile(src, function (err, data) {
            if (err) {
                done(err);
                return;
            }

            data = handlebars.compile(data.toString())(self.context);
            fse.mkdirp(path.dirname(dest), function (err) {
                if (err) {
                    done(err);
                    return;
                }

                fse.writeFile(dest, data, done);
            });
        });
    }, callback);
};

module.exports = Generator;
