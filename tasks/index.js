/*
 * grunt-merge-with-master
 * 
 * Copyright (c) 2017 Yaser, contributors
 * Licensed under the MIT license.
 * https://github.com/Yaser-Amin/grunt-merge-with-master/blob/master/LICENSE
 */

'use strict';

module.exports = function(grunt) {
  var path = require('path');
  var fs = require('fs');
  var chalk = require('chalk');
  var fileSyncCmp = require('file-sync-cmp');
  var isWindows = process.platform === 'win32';
  var _ = require('lodash');

  grunt.registerMultiTask('masterMerge', 'Merge JSON files with master JSON file', function() {

    var options = this.options({
      encoding: grunt.file.defaultEncoding,
      processContent: false,
      processContentExclude: [],
      //timestamp: false,
      mode: false
    });

    var copyOptions = {
      encoding: options.encoding,
      process: options.process || options.processContent,
      noProcess: options.noProcess || options.processContentExclude
    };

    var detectDestType = function(dest) {
      if (grunt.util._.endsWith(dest, '/')) {
        return 'directory';
      } else {
        return 'file';
      }
    };

    var unixifyPath = function(filepath) {
      if (isWindows) {
        return filepath.replace(/\\/g, '/');
      } else {
        return filepath;
      }
    };

    /*var syncTimestamp = function (src, dest) {
      var stat = fs.lstatSync(src);
      if (path.basename(src) !== path.basename(dest)) {
        return;
      }

      if (stat.isFile() && !fileSyncCmp.equalFiles(src, dest)) {
        return;
      }

      var fd = fs.openSync(dest, isWindows ? 'r+' : 'r');
      fs.futimesSync(fd, stat.atime, stat.mtime);
      fs.closeSync(fd);
    };*/

    var isExpandedPair;
    var dirs = {};
    var tally = {
      dirs: 0,
      files: 0
    };

    this.files.forEach(function(filePair) {
      isExpandedPair = filePair.orig.expand || false;

      filePair.src.forEach(function(src) {
        src = unixifyPath(src);
        var dest = unixifyPath(filePair.dest);

        if (detectDestType(dest) === 'directory') {
          dest = isExpandedPair ? dest : path.join(dest, src);
        }

        if (grunt.file.isDir(src)) {
          grunt.verbose.writeln('Creating ' + chalk.cyan(dest));
          grunt.file.mkdir(dest);
          if (options.mode !== false) {
            fs.chmodSync(dest, (options.mode === true) ? fs.lstatSync(src).mode : options.mode);
          }

          if (options.timestamp) {
            dirs[dest] = src;
          }

          tally.dirs++;
        } else {
          grunt.verbose.writeln('Merging ' + chalk.cyan(src) + ' -> ' + chalk.cyan(dest));
          const masterCoontent = JSON.parse(fs.readFileSync(filePair.master));
          const fileContent = JSON.parse(fs.readFileSync(src));
          _.merge(masterCoontent, fileContent);
          grunt.file.write(dest, JSON.stringify(masterCoontent));
          //syncTimestamp(src, dest);
          if (options.mode !== false) {
            fs.chmodSync(dest, (options.mode === true) ? fs.lstatSync(src).mode : options.mode);
          }
          tally.files++;
        }
      });
    });

    /*if (options.timestamp) {
      Object.keys(dirs).sort(function (a, b) {
        return b.length - a.length;
      }).forEach(function (dest) {
        syncTimestamp(dirs[dest], dest);
      });
    }*/

    if (tally.dirs) {
      grunt.log.write('Created ' + chalk.cyan(tally.dirs.toString()) + (tally.dirs === 1 ? ' directory' : ' directories'));
    }

    if (tally.files) {
      grunt.log.write((tally.dirs ? ', merged ' : 'Merged ') + chalk.cyan(tally.files.toString()) + (tally.files === 1 ? ' file' : ' files'));
    }

    grunt.log.writeln();
  });

};
