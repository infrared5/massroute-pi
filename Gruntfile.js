/*global module:false*/
/**
 * For grunt ~0.4.0 only.
 * https://github.com/gruntjs/grunt/wiki/Upgrading-from-0.3-to-0.4
 */
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('./package.json'),
    jshint: {
      files: ['Gruntfile.js', 'script/**/*.js', 'test/**/*.spec.js'],
      options: {
        strict: false,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: false,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        es5: true,
        loopfunc: true,
        // trailing: true,
        browser: true,
        node: false,
        globals: {
          console: true,
          jQuery: true,
          require: true,
          requirejs: true,
          define: true,
          Handlebars: true,
          Sammy: true,
          jasmine: true,
          describe: true,
          it: true,
          beforeEach: true,
          afterEach: true,
          expect: true,
          AsyncSpec: true,
          spyOn: true,
          sinon: true
        }
      }
    },
    jasmine_node: {
      options: {
          forceExit: true,
          match: '.',
          matchall: false,
          extensions: 'js',
          specNameMatcher: 'spec',
          jUnit: {
            report: false,
            savePath : "./build/reports/jasmine/",
            useDotNotation: true,
            consolidate: true
          }
        },
        all: ['./test/spec/']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jasmine-node');

  // simple lint and test
  grunt.registerTask('default', ['jshint', 'jasmine_node']);
};
