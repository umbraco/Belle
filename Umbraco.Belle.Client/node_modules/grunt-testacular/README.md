# grunt-testacular

A wrapper for [grunt](http://gruntjs.com) around
[testacular](http://vojtajina.github.com/testacular/) that lets you 
run multiple instances of testacular. 

> As of v 0.3.0 `testacularServer` is now called `testacular`.

## Installation

First you need to install this plugin in your project

```bash
$ npm install grunt-testacular
```

then load the tasks in your Gruntfile with

```javascript
grunt.loadNpmTasks('grunt-testacular');
```
And now you can run
```bash
$ grunt testacular
```
to start up the server.

## Usage
There are two tasks provided `testacular` and `testacularRun`. 

### `testacularServer`
This task is the equivalent of `testacular start <options>
<configFile>`. You can use it to do single runs or to `autoWatch`
files and directories. To use it you need to at least specify a
`configFile`. All other options can be defined in the `configFile` but
you can also override some of these.

**simple example**

```javascript
testacular: {
  unit: {
    options: {
      configFile: 'config/testacular.conf.js'
    }
  }
}
```

**advanced example**

```javascript
testacular: {
  unit: {
    options: {
      configFile: 'config/testacular.conf.js',
      autoWatch: true,
      browsers: [ 'Chrome', 'PhantomJS' ],
      reporters: [ 'dots' ],
      runnerPort: 9101
    }
  }
}
```
And if you want to keep the server running.
```javascript
testacular: {
  unit: {
    options: {
      configFile: 'config/testacular.conf.js',
      keepalive: true
    }
  }
}
```

### `testacularRun`
This task is the equivalent of running `testacular run <options>`.
There is only one option available, that is `runnerPort` that defines
the port where the server is listening.

```javascript
testacularRun: {
  unit: {
    options: {
      runnerPort: 9101
    }
  }
}
```

## Release History
* v0.3.0 - Complete Rewrite
* v0.2.2 - Add ability to use grunt templates.
* v0.2.1 - Make Grunt 0.4.0a compatible.
* v0.2.0 - Added `keepalive` option.
* v0.1.0 - First release on npm.

