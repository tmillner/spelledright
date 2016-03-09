module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.initConfig({
    META_all: "./**/*.es6",
    watch: {
      es6Files: {
        files: ["<%= META_all %>"],
        tasks: ["babel:es6Files", "eslint"]
      }
    },
    babel: {
      options: {
        sourceMap: false,
        presets: ["es2015"]
      },
      es6Files: {
        files: [{
          expand: true,
          src: ["!node_modules", "<%= META_all %>"],
          ext: ".js",
          extDot: "last"
        }]
      }
    },
    eslint: {
      options: {
        configFile: ".eslintrc.json"
      },
      target: ["<%= META_all %>"]
    },
    jasmine: {
      'run-all': {
        src: ['!Gruntfile.js', '/*.js'],
        options: {
          specs: "spec/*.spec.js",
          helpers: "spec/helpers/*"
        }
      }
    }
  });
};
