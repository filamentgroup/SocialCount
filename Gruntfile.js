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
				src: [
					'src/socialcount.js',
					'src/networks/facebook.js',
					'src/networks/twitter.js',
					'src/networks/googleplus.js',
					'src/networks/pinterest.js',
					// 'src/networks/sharethis.js',
				],
				dest: 'dist/socialcount.js'
			},
			distcss: {
				src: [
					'src/socialcount.css',
					'src/networks/facebook.css',
					'src/networks/pinterest.css',
					// 'src/networks/sharethis.css',
					'src/loading.css'
				],
				dest: 'dist/socialcount.css'
			},
			distcsswithicons: {
				src: [
					'<%= concat.distcss.dest %>',
					'src/socialcount-icons.css'
				],
				dest: 'dist/socialcount-with-icons.css'
			}
		},
		sass: {
			icons: {
				options: {
					compass: true
				},
				files: {
					'src/socialcount-icons.css': 'src/socialcount-icons.scss'
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
			files: ['<%= concat.distjs.src %>', '<%= concat.distcsswithicons.src %>'],
			tasks: 'default'
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			src: ['src/**/*.js']
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
	grunt.registerTask( 'build-icons', [ 'sass', 'default' ] );
	grunt.registerTask( 'default', [ 'jshint', 'concat', 'usebanner', 'copy', 'qunit' ] );
	grunt.registerTask( 'stage', [ 'default' ]);
	grunt.registerTask( 'release', [ 'clean', 'build-icons', 'compress' ] );
};
