# grunt-merge-with-master 1.0.0
> Merge JSON files with master file


## Getting Started

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-merge-with-master --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-merge-with-master');
```


## Uglify task
_Run this task with the `grunt mergeMaster` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Options

#### master
Type: `string`
Default: ``

Path to master json file


### Usage examples

#### Basic compression

This configuration will compress and mangle the input files using the default options.

```js
// Project configuration.
grunt.initConfig({
  masterMerge: {
      merge: {
        files: [
          {
            expand: true,
            cwd: './documentation/src/',
            src: ['**/*.json', '!api.json'],
            dest: './documentation/dest/',
            master: './documentation/src/api.json',
          },
        ],
      },
    },
});
```
