module.exports = function(grunt){

  var rewrite = require( "connect-modrewrite" );

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    config: grunt.file.readJSON('config/env.json'),

    envpreprocess:{
      dev:{
        files:{
          src:  'config/env.json'
        },
        options:{
          replacePath: ['**/index.html'],
          environment: 'dev'
        }
      },
      prod:{
        files:{
          src:  'config/env.json'
        },
        options:{
          replacePath: ['**/index.html'],
          environment: 'prod'
        }
      }
    },

    connect: {
      dev: {
        options: {
          port:  '<%= config.PORT.dev %>',
          //livereload: 35729,
          base: ".",
          middleware: function ( connect, options, middlewares ) {
            var rules = [
              "!\\.html|\\.js|\\.css|\\.svg|\\.jp(e?)g|\\.png|\\.gif|\\.ico|\\.woff2|\\.woff|\\.ttf$ /index.html"
            ];
            middlewares.unshift( rewrite( rules ) );
            return middlewares;
          }
        }
      },
      prod: {
        options: {
          port: '<%= config.PORT.prod %>',
          //livereload: 35729,
          base: ".",
          middleware: function ( connect, options, middlewares ) {
            var rules = [
              "!\\.html|\\.js|\\.css|\\.svg|\\.jp(e?)g|\\.png|\\.gif|\\.ico|\\.woff2|\\.woff|\\.ttf$ /index.html"
            ];
            middlewares.unshift( rewrite( rules ) );
            return middlewares;
          }
        }
      }
    },

    uglify: {
      js: {
        files: {
          'app.min.js': ['app.js']
        }
      }
    },

    sass: {
      dist: {
        files: {
          'styles/main.css': ['styles/sass/main.scss']
        }
      }
    },

    cssmin: {
      css: {
        files: {
          'styles/main.min.css': ['styles/main.css']
        }
      }
    },

    wiredep: {
      task: {
        src: [
          'index.html'
        ]
      }
    },

    watch: {
      options: {
        livereload: true
      },
      //files: ['**/*.html', 'app.js', 'app/**/*.js', 'modules/**/*.js', 'app/**/*.json', 'modules/**/*.json', 'styles/**/*.scss'],
      files: ['styles/**/*.scss'],
      tasks: ['sass']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-envpreprocess');

  grunt.registerTask('serve', ['envpreprocess:dev', 'connect:dev', 'wiredep', 'watch']);

  grunt.registerTask('prod', ['envpreprocess:prod', 'connect:prod', 'wiredep']);

};
