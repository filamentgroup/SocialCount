/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
		concat: {
			options: {
				stripBanners: true
			},
			distjs: {
				src: ['src/<%= pkg.name %>.js'],
				dest: 'dist/<%= pkg.name %>.js'
			},
			distcss: {
				src: ['src/<%= pkg.name %>.css'],
				dest: 'dist/<%= pkg.name %>.css'
			},
			distcsswithicons: {
				src: ['src/<%= pkg.name %>.css', 'src/<%= pkg.name %>-icons.css'],
				dest: 'dist/<%= pkg.name %>-with-icons.css'
			}
		},
		uglify: {
			distjs: {
				src: '<%= concat.distjs.dest %>',
				dest: 'dist/<%= pkg.name %>.min.js'
			}
		},
		cssmin: {
			distcss: {
				files: {
					'dist/<%= pkg.name %>.min.css': ['<%= concat.distcss.dest %>']
				}
			},
			distcsswithicons: {
				files: {
					'dist/<%= pkg.name %>-with-icons.min.css': ['<%= concat.distcsswithicons.dest %>']
				}
			}
		},
		copy: {
			images: {
				cwd: 'src/',
				src: '*.png',
				dest: 'dist/',
				expand: true,
				flatten: true
			},
			service: {
				cwd: 'src/service/',
				src: '**',
				dest: 'dist/service/',
				expand: true,
				flatten: true
			}
		},
		qunit: {
			all: ['test/**/*.html']
		},
		watch: {
			files: '<%= jslint.all %>',
			tasks: 'jshint qunit'
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
				browser: true,
				globals: {
					jQuery: false,
					require: false
				}
			},
			all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
		},
		clean: ['dist'],
		compress: {
			zip: {
				options: {
					archive: 'dist/socialcount.zip'
				},
				files: [
					{
						expand: true,
						cwd: 'dist/',
						src: ['*.js', '*.css', '*.png', 'service/**' ],
						dest: 'socialcount/'
					}
				]
			}
		},
		usebanner: {
			dist: {
				options: {
					position: 'top',
					banner: '<%= banner %>'
				},
				files: {
					src: [ 'dist/*.js', 'dist/*.css' ]
				}
			}
		}
	});

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// Default task.
	grunt.registerTask( 'default', [ 'jshint', 'qunit' ] );
	grunt.registerTask( 'stage', [ 'default' ]);
	grunt.registerTask( 'release', [ 'clean', 'jshint', 'qunit', 'concat', 'uglify', 'cssmin', 'usebanner', 'copy', 'compress' ] );
};
