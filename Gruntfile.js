'use strict';

var request = require('request');

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    var reloadPort = 35729, files;

    var appConfig = {
        app:  'app',
        public: 'public',
        dist: 'dist',
        config: 'config'
    };

    grunt.initConfig({

        // Project settings
        yeoman: appConfig,

        pkg: grunt.file.readJSON('package.json'),
        develop: {
            server: {
                file: 'app.js'
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/public/css/style.css': [
                        '<%= yeoman.public %>/css/style.css'
                    ]
                }
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/'
                    ]
                }]
            },
            server: '.tmp'
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>/views/',
                    dest: '<%= yeoman.dist %>/app/views/',
                    src: [
                        '*.ejs',
                        '**/*.ejs',
                        '*.html',
                        '**/*.html'
                    ]
                }, {
                    expand: true,
                    cwd: '<%= yeoman.public %>/img',
                    dest: '<%= yeoman.dist %>/img',
                    src: ['*']
                },  {
                    expand: true,
                    cwd: '<%= yeoman.public %>/components/materialize/dist/font',
                    dest: '<%= yeoman.dist %>/public/font/',
                    src: ['*', '**/*']
                }, {
                    expand: true,
                    cwd: '<%= yeoman.public %>/components/components-font-awesome/fonts',
                    dest: '<%= yeoman.dist %>/public/font/font-awesome',
                    src: ['*', '**/*']
                }, {
                    '<%= yeoman.dist %>/public/css/materialize.css':'<%= yeoman.public %>/components/materialize/dist/css/materialize.min.css'
                }, {
                    '<%= yeoman.dist %>/public/js/materialize.js':'<%= yeoman.public %>/components/materialize/dist/css/materialize.min.js'
                }, {
                    '<%= yeoman.dist %>/public/js/jquery.js':'<%= yeoman.public %>/components/jquery/dist/jquery.min.js'
                }, {
                    '<%= yeoman.dist %>/public/css/font-awesome.css':'<%= yeoman.public %>/css/font-awesome.css'
                }, {
                    '<%= yeoman.dist %>/public/js/chart.js':'<%= yeoman.public %>/components/Chart.js/Chart.min.js'
                }, {
                    '<%= yeoman.dist %>/public/js/promise.js':'<%= yeoman.public %>/components/promise-polyfill/Promise.min.js'
                }]
            },
            dev: {
                files:[{
                    '<%= yeoman.public %>/css/materialize.css':'<%= yeoman.public %>/components/materialize/dist/css/materialize.css'
                }, {
                    '<%= yeoman.public %>/js/materialize.js':'<%= yeoman.public %>/components/materialize/dist/js/materialize.js'
                },{
                    '<%= yeoman.public %>/js/jquery.js':'<%= yeoman.public %>/components/jquery/dist/jquery.js'
                }, {
                    '<%= yeoman.public %>/js/chart.js':'<%= yeoman.public %>/components/Chart.js/Chart.min.js'
                }, {
                    '<%= yeoman.public %>/js/promise.js':'<%= yeoman.public %>/components/promise-polyfill/Promise.js'
                }]
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: {
                src: [
                    'Gruntfile.js',
                    '<%= yeoman.app %>/**/*.js',
                    '<%= yeoman.public %>/js/*.js'
                ]
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/spec/{,*/}*.js']
            }
        },
        wiredep: {
            app: {
                src: ['<%= yeoman.app %>/views/header.ejs', '<%= yeoman.app %>/views/footer.ejs'],
                ignorePath:  /\.\.\//
            }
        },
        //useminPrepare: {
        //    html: ['<%= yeoman.app %>/views/header.ejs', '<%= yeoman.app %>/views/footer.ejs'],
        //    options: {
        //        dest: '<%= yeoman.dist %>/',
        //        flow: {
        //            html: {
        //                steps: {
        //                    js: ['concat', 'uglifyjs'],
        //                    css: ['cssmin']
        //                },
        //                post: {}
        //            }
        //        }
        //    }
        //},
        //usemin: {
        //    html: ['<%= yeoman.dist %>/app/views/*.ejs'],
        //    css: ['<%= yeoman.dist %>/public/css/{,*/}*.css'],
        //    options: {
        //        assetsDirs: ['<%= yeoman.app %>/','<%= yeoman.public %>/img']
        //    }
        //},
        less: {
            dist: {
                files: {
                    '<%= yeoman.public %>/css/style.css': '<%= yeoman.public %>/css/style.less'
                }
            }
        },
        watch: {
            options: {
                nospawn: true,
                livereload: reloadPort
            },
            js: {
                files: [
                    'app.js',
                    '<%= yeoman.app %>/**/*.js',
                    '<%= yeoman.public %>/**/*.js',
                    'config/*.js'
                ],
                tasks: ['develop', 'delayed-livereload']
            },
            css: {
                files: [
                    '<%= yeoman.public %>/css/*.less'
                ],
                tasks: ['less'],
                options: {
                    livereload: reloadPort
                }
            },
            views: {
                files: [
                    '<%= yeoman.app %>/views/*.ejs',
                    '<%= yeoman.app %>/views/**/*.ejs'
                ],
                options: {
                    livereload: reloadPort,
                    reload:true
                }
            }
        },
        uglify: {
            options: {
                banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
            },
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/',
                    src: ['*.js', '**/*.js'],
                    dest: '<%= yeoman.dist %>/app'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.public %>/js',
                    src: ['*.js', '**/*.js'],
                    dest: '<%= yeoman.dist %>/public/js'
                }, {
                    '<%= yeoman.dist %>/app.js': 'app.js'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.config %>/',
                    src: ['*.js', '**/*.js'],
                    dest: '<%= yeoman.dist %>/config'
                }]
            }
        }
    });

    grunt.config.requires('watch.js.files');
    files = grunt.config('watch.js.files');
    files = grunt.file.expand(files);

    grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
        var done = this.async();
        setTimeout(function () {
            request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','), function (err, res) {
                var reloaded = !err && res.statusCode === 200;
                if (reloaded)
                    grunt.log.ok('Delayed live reload successful.');
                else
                    grunt.log.error('Unable to make a delayed live reload.');
                done(reloaded);
            });
        }, 500);
    });

    grunt.registerTask('default', [
        'jshint',
        'build'
    ]);

    grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            //'wiredep',
            'less',
            'copy:dev',
            'develop',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        'karma'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'wiredep',
        'less',
        'cssmin',
        'uglify',
        'copy:dist',
        'develop'
    ]);
};
