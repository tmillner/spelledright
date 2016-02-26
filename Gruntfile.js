module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jasmine');

	grunt.initConfig({
		"watch" : {
			"rootEs6" : {
				"files" : ["./**/*.es6"],
				"tasks" : ["babel:rootConversion"]
			},
			"jasmineSpecsEs6" : {
				"files" : ["spec/**/*.es6"],
				"tasks" : ["babel:jasmineSpecs"]
			},
			"jstests" : {
				"files" : ["./**/*.js"],
				"tasks" : ["jasmine"]	
			}
		},
		"babel" : {
			"options" : {
				"sourceMap": true,
				"presets": ["es2015"]
			},
			"rootConversion": {
				"files": [
				{
					"expand": true,
					"src": ["*.es6"],
					"cwd": "./",
					"dest": "lib/",
					"ext": ".js",
					"extDot": "last",
					"flatten": true
				}]
			},
			"jasmineSpecs": {
				"specdir" : "spec/",
				"options" : {
					"sourceMap": false,
				},
				"files": [
				{
					"expand": true,
					"src": ["spec/**/*.es6"],
					"ext": ".js",
					"extDot": "last",
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
