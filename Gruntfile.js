module.exports = function( grunt ) {

	// Project configuration
	grunt.initConfig( {
		pkg:    grunt.file.readJSON( 'package.json' ),
		concat: {
			options: {
				stripBanners: true,
				banner: '/*! <%= pkg.title %> - v<%= pkg.version %>\n' +
					' * <%= pkg.homepage %>\n' +
					' * Copyright (c) <%= grunt.template.today("yyyy") %>;' +
					' * Licensed GPLv2+' +
					' */\n'
			},
			main: {
				src: [
					'assets/js/src/content-scheduler.js'
				],
				dest: 'assets/js/content-scheduler.js'
			}
		},
		jshint: {
			all: [
				'Gruntfile.js',
				'assets/js/src/**/*.js',
				'assets/js/test/**/*.js'
			]
		},
		uglify: {
			all: {
				files: {
					'assets/js/content-scheduler.min.js': ['assets/js/content-scheduler.js']
				},
				options: {
					banner: '/*! <%= pkg.title %> - v<%= pkg.version %>\n' +
						' * <%= pkg.homepage %>\n' +
						' * Copyright (c) <%= grunt.template.today("yyyy") %>;' +
						' * Licensed GPLv2+' +
						' */\n',
					mangle: {
						except: ['jQuery']
					}
				}
			}
		},
		
		
		autoprefixer: {
			dist: {
				options: {
					browsers: [ 'last 1 version', '> 1%', 'ie 8' ]
				},
				files: { 
					'assets/css/content-scheduler.css': [ 'assets/css/src/content-scheduler.css' ]
				}
			}
		},
		
		cssmin: {
			options: {
				banner: '/*! <%= pkg.title %> - v<%= pkg.version %>\n' +
					' * <%=pkg.homepage %>\n' +
					' * Copyright (c) <%= grunt.template.today("yyyy") %>;' +
					' * Licensed GPLv2+' +
					' */\n',
				processImport: false
			},
			minify: {
				expand: true,

				cwd: 'assets/css/',
				src: ['content-scheduler.css'],

				dest: 'assets/css/',
				ext: '.min.css'
			}
		},
		watch:  {
			livereload: {
				files: ['assets/css/*.css'],
				options: {
					livereload: true
				}
			},
			styles: { 
				files: ['assets/css/src/*.css'],
				tasks: ['autoprefixer', 'cssmin'],
				options: {
					debounceDelay: 500
				}
			},
			scripts: {
				files: ['assets/js/src/**/*.js', 'assets/js/vendor/**/*.js'],
				tasks: ['jshint', 'concat', 'uglify'],
				options: {
					debounceDelay: 500
				}
			}
		},
		clean: {
			main: ['release/<%= pkg.version %>']
		},
		copy: {
			// Copy the plugin to a versioned release directory
			main: {
				src:  [
					'**',
					'!**/.*',
					'!**/readme.md',
					'!node_modules/**',
					'!vendor/**',
					'!tests/**',
					'!release/**',
					'!assets/css/sass/**',
					'!assets/css/src/**',
					'!assetsjs/src/**',
					'!images/src/**',
					'!bootstrap.php',
					'!bower.json',
					'!composer.json',
					'!composer.lock',
					'!Gruntfile.js',
					'!package.json',
					'!phpunit.xml',
					'!phpunit.xml.dist'
				],
				dest: 'release/<%= pkg.version %>/'
			}
		},
		compress: {
			main: {
				options: {
					mode: 'zip',
					archive: './release/pkcs.<%= pkg.version %>.zip'
				},
				expand: true,
				cwd: 'release/<%= pkg.version %>/',
				src: ['**/*'],
				dest: 'pkcs/'
			}
		},
		wp_readme_to_markdown: {
			readme: {
				files: {
					'readme.md': 'readme.txt'
				}
			}
		},
		phpunit: {
			classes: {
				dir: 'tests/phpunit/'
			},
			options: {
				bin: 'vendor/bin/phpunit',
				bootstrap: 'bootstrap.php',
				colors: true
			}
		},
		qunit: {
			all: ['tests/qunit/**/*.html']
		}
	} );

	// Load tasks
	require('load-grunt-tasks')(grunt);

	// Register tasks
	
	grunt.registerTask( 'default', ['jshint', 'concat', 'uglify', 'autoprefixer', 'cssmin', 'wp_readme_to_markdown' ] );
	

	grunt.registerTask( 'build', ['default', 'clean', 'copy', 'compress'] );

	grunt.registerTask( 'test', ['phpunit', 'qunit'] );

	grunt.util.linefeed = '\n';
};
