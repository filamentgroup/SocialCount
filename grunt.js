/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: '<json:package.json>',
		meta: {
			banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
				' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
		},
		concat: {
			distjs: {
				src: ['<banner:meta.banner>', '<file_strip_banner:src/<%= pkg.name %>.js>'],
				dest: 'dist/<%= pkg.name %>.js'
			},
			distcss: {
				src: ['<banner:meta.banner>', '<file_strip_banner:src/<%= pkg.name %>.css>'],
				dest: 'dist/<%= pkg.name %>.css'
			},
			distcsswithicons: {
				src: ['<banner:meta.banner>', '<file_strip_banner:src/<%= pkg.name %>.css>', '<file_strip_banner:src/<%= pkg.name %>-icons.css>'],
				dest: 'dist/<%= pkg.name %>-with-icons.css'
			}
		},
		min: {
			distjs: {
				src: ['<banner:meta.banner>', '<config:concat.distjs.dest>'],
				dest: 'dist/<%= pkg.name %>.min.js'
			}
		},
		cssmin: {
			distcss: {
				src: ['<config:concat.distcss.dest>'],
				dest: 'dist/<%= pkg.name %>.min.css'
			},
			distcsswithicons: {
				src: ['<config:concat.distcsswithicons.dest>'],
				dest: 'dist/<%= pkg.name %>-with-icons.min.css'
			}
		},
		copy: {
			dist: {
				files: {
					"dist/": "src/*.png"
				}
			}
		},
		qunit: {
			files: ['test/**/*.html']
		},
		lint: {
			files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
		},
		watch: {
			files: '<config:lint.files>',
			tasks: 'lint qunit'
		},
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true
			},
			globals: {
				jQuery: true
			}
		},
		uglify: {},
		clean: ["dist"]
	});

	grunt.loadNpmTasks('grunt-css');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');

	// Default task.
	grunt.registerTask('default', 'clean lint qunit concat min cssmin copy');
};
