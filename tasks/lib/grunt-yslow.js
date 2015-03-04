exports.init = function(grunt) {
  var exports = {},
      path = require('path');
  exports.yslow = function(url, report, options, callback) {

    var pathToYSlow = path.resolve('./node_modules/grunt-yslow-test/tasks/lib/yslow.js'),
        phantomJsCommand = 'phantomjs',
        command = pathToYSlow,
        exec = require('child_process').exec;

    if (options.phantomjs.ignore_ssl_errors) {
      phantomJsCommand += ' --ignore_ssl_errors=' + options.phantomjs.ignore_ssl_errors;
    }

    // Add options documented in the following web site:
    //   http://yslow.org/phantomjs/
    if (options.info) {
      command += ' -i ' + options.info;
    }

    if (options.format) {
      command += ' -f ' + options.format;
    }

    if (options.ruleset) {
      command += ' -r ' + options.ruleset;
    }

    if (options.threshold) {
      command += ' -t ' + options.threshold;
    }

    if (options.ua) {
      command += ' -u ' + options.ua;
    }

    if (options.viewport) {
      command += ' -vp ' + options.viewport;
    }

    if (options.headers) {
      command += ' -ch ' + options.headers;
    }

    command += " " + url;
    command = phantomJsCommand + command;
    grunt.log.write("Command: " + command);

    function puts(error, stdout, stderr) {
      grunt.log.write('\nRunning YSlow on "' + url + '":\n');

      if (report) {
        grunt.log.write("Saving report to "+report);
        grunt.file.write(report, stdout);
      } else {
        grunt.log.write(stdout);
      }

      if ( error !== null ) {
        callback(error);
      } else {
        callback();
      }
    }

    exec(command, puts);

  };

  return exports;
};
