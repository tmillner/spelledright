module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jasmine');

	grunt.initConfig({
		"watch" : {
			"es6Files" : {
				"files" : ["./**/*.es6"],
				"tasks" : ["babel:es6Files"]
			},
		},
		"babel" : {
			"options" : {
				"sourceMap": false,
				"presets": ["es2015"]
			},
			"es6Files": {
				"files": [
				{
					"expand": true,
					"src": ["!node_modules", "./**/*.es6"],
					"ext": ".js",
					"extDot": "last"
				}]
			}
		},
		"jasmine" : {
			"run-all" : {
				"src" : ['!Gruntfile.js','/*.js'],
				"options" : {
					"specs" : "spec/*.spec.js",
					"helpers" : "spec/helpers/*"
				}
			}
		}
	});
};

//"jstests" : {
//				"files" : ["./**/*.js"],
//				"tasks" : ["jasmine"]	
//			}