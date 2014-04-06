/*
 * grunt-meta-excel
 * Copyright (c) 2014 daikiueda, @ue_di
 * Licensed under the MIT license.
 * https://github.com/daikiueda/grunt-meta-excel
 */

"use strict";

module.exports = function( grunt ){

    grunt.initConfig( {
        meta_excel: {
            options: {
                dataStartingRow: 7,
                mapping: {
                    path: "E",
                    title: "B",
                    title_all: "F",
                    description: "H",
                    keywords: "J",
                    url: "L",
                    thumbnail: "M"
                }
            },
            test_site: {
                xlsx: "sample/sitemap.xlsm",
                htmlDir: "sample/htdocs/"
            }
        },

        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= mochaTest.test.src %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        mochaTest: {
            test: {
                options: {
                    reporter: "spec"
                },
                src: [ "test/**/*.js" ]
            }
        }
    } );

    grunt.loadTasks( "tasks" );

    grunt.loadNpmTasks( "grunt-contrib-jshint" );
    grunt.loadNpmTasks( "grunt-mocha-test" );

    grunt.registerTask( "test", [ "mochaTest" ] );
    grunt.registerTask( "default", [ "jshint", "test" ] );
};
