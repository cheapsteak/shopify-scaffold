/*global process: false, module:false */
module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: true
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      scripts: {
        src: ['scripts/**/*.js']
      }
    },
    uglify: {
      options: {
        mangle: false,
        sourceMap: true
      },
      dist: {
        files: {
          '.tmp/uglify/plugins.js' : ['scripts/plugins/**.js'],
          '.tmp/uglify/main.js' : ['scripts/**.js', '!scripts/plugins/**.js']
        }
      }
    },
    sass: {
      dist: {
        options: {
          sourcemap: true
        },
        files: {
          '.tmp/sass/main.css.liquid': 'sass/main.sass',
          '.tmp/sass/checkout.css.liquid': 'sass/checkout.scss'
        }
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 version', 'ie 9']
      },
      multiple_files: {
        expand: true,
        flatten: true,
        src: '.tmp/sass/*.css.liquid',
        dest: '.tmp/autoprefixer/'
      },
    },
    copy: {
      main: {
        options: {
          process: function (content, srcpath) {
            if (srcpath.slice(-4) === '.map') {
              var sourcemap = JSON.parse(content);
              sourcemap.sources = sourcemap.sources.map(function (path) {
                return path.replace('..\\..\\','');
              });
              sourcemap.sourceRoot = 'http://127.0.0.1:' + (process.env.PORT || 9000) + '/';
              content = JSON.stringify(sourcemap);
            }
            return content;
          }
        },
        files: [
          { 
            expand: true,
            flatten: true,
            src: ['images/**/*'],
            dest:'deploy/assets/'
          },
          { 
            expand: true,
            flatten: true,
            src: ['markup/config/**/*'],
            dest:'deploy/config/'
          },
          { 
            expand: true,
            flatten: true,
            src: ['markup/layout/**/*'],
            dest:'deploy/layout/'
          },
          { 
            expand: true,
            flatten: true,
            src: ['markup/snippets/**/*'],
            dest:'deploy/snippets/'
          },
          { 
            expand: true,
            flatten: true,
            src: ['markup/templates/**/*'],
            dest:'deploy/templates/'
          },
          { 
            expand: true,
            flatten: true,
            src: ['.tmp/autoprefixer/**/*', '.tmp/uglify/**/*'],
            dest:'deploy/assets/'
          }
        ]
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      uglify: {
        files: ['scripts/**/*.js'],
        tasks: ['newer:uglify']
      },
      sass: {
        files: 'sass/**.{sass,scss}',
        tasks: ['sass']
      },
      autoprefixer: {
        files: ['.tmp/sass/*.css', '.tmp/sass/*.css.liquid'],
        tasks: ['newer:autoprefixer']
      },
      copy: {
        files: [
          '.tmp/autoprefixer/**',
          '.tmp/uglify/**',
          'images/**/*',
          'markup/**/*'
        ],
        tasks: ['newer:copy']
      },
      shopify: {
        files: ['deploy/**'],
        tasks: ['newer:shopify']
      }
    },

    shopify: {
      options: {
        api_key: process.env.API_KEY,
        password: process.env.PASSWORD,
        url: "scaffold.myshopify.com",
        base: "deploy/"
      }
    },

    connect: {
      server: {
        options: {
          hostname: '127.0.0.1',
          port: process.env.PORT || 9000
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-shopify');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('default', ['connect','watch']);
};