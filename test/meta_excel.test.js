"use strict";

var TEMP_DIR = "./.tmp",

    exec = require( "child_process" ).exec,
    expect = require( "chai" ).expect,
    
    path = require( "path" ),
    fs = require( "fs" ),
    Q = require( "q" ),
    iconv = require( "iconv-lite" );


describe( "grunt-meta-excel", function(){
    
    before( function(){
        prepareTestFiles();
    } );
    
    after( function(){
        removeTestFiles();
    } );


    describe( "Update meta tags.", function(){
        before( function( done ){
            exec( "grunt meta_excel:test_utf8_update", function(){
                done();
            } );
        } );

        it( "内容が更新される。", function(){
            expect( fs.readFileSync( path.join( TEMP_DIR, "htdocs_utf8_update/sample_dir_1/sample_subdir/sample_2.html" ), "utf8" ) )
                .to.contain( "サンプルページ2 | サンプルサブカテゴリー | サンプルカテゴリー1 | サンプルサイト" );
        } );
    } );

    
    describe( "Generate html files.", function(){
        before( function( done ){
            exec( "grunt meta_excel:test_utf8_generate:generate", function(){
                done();
            } );
        } );

        it( "HTMLファイルが生成される。", function(){
            expect( fs.existsSync( path.join( TEMP_DIR, "htdocs_utf8_generate/sample_dir_1/sample_subdir/sample_2.html" ) ) )
                .to.be.true;
        } );

        it( "内容がxlsxどおりである。", function(){
            expect( fs.readFileSync( path.join( TEMP_DIR, "htdocs_utf8_generate/sample_dir_1/sample_subdir/sample_2.html" ), "utf8" ) )
                .to.contain( "サンプルページ2 | サンプルサブカテゴリー | サンプルカテゴリー1 | サンプルサイト" );
        } );
    } );
    
    
    describe( "options", function(){

        describe( "charset ( e.g. shift_jis )", function(){

            describe( "Update meta tags.", function(){
                before( function( done ){
                    exec( "grunt meta_excel:test_sjis_update", function(){
                        done();
                    } );
                } );

                it( "内容が更新される。", function(){
                    var updatedFileContent =iconv.decode(
                        fs.readFileSync( path.join( TEMP_DIR, "htdocs_sjis_update/sample_dir_1/sample_subdir/sample_2.html" ) ),
                        "shift_jis"
                    );

                    expect( updatedFileContent ).to.contain( "サンプルページ2 | サンプルサブカテゴリー | サンプルカテゴリー1 | サンプルサイト" );
                    expect( updatedFileContent ).to.contain( "<h1>サンプルHTML（Shift_JIS）</h1>" );
                } );
            } );

            describe( "Generate html files.", function(){
                before( function( done ){
                    exec( "grunt meta_excel:test_sjis_generate:generate", function(){
                        done();
                    } );
                } );

                it( "HTMLファイルが生成される。", function(){
                    expect( fs.existsSync( path.join( TEMP_DIR, "htdocs_sjis_generate/sample_dir_1/sample_subdir/sample_2.html" ) ) )
                        .to.be.true;
                } );

                it( "内容がxlsxどおりである。", function(){
                    var updatedFileContent =iconv.decode(
                        fs.readFileSync( path.join( TEMP_DIR, "htdocs_sjis_generate/sample_dir_1/sample_subdir/sample_2.html" ) ),
                        "shift_jis"
                    );

                    expect( updatedFileContent ).to.contain( "サンプルページ2 | サンプルサブカテゴリー | サンプルカテゴリー1 | サンプルサイト" );
                    expect( updatedFileContent ).to.contain( "<h1>サンプルHTML（Shift_JIS）</h1>" );
                } );
            } );
        } );

        describe( "patternsJsonPath", function(){
            before( function( done ){
                prepareTestFiles();
                exec( "grunt meta_excel:test_pattern_json_file:generate", function(){
                    done();
                } );
            } );

            it( "指定されたパターンにもとづいて内容が適用される。", function(){
                expect( fs.readFileSync( path.join( TEMP_DIR, "htdocs_utf8_generate/sample_dir_1/sample_subdir/sample_2.html" ), "utf8" ) )
                    .to.contain( '<title data-test="test">サンプルページ2 | サンプルサブカテゴリー | サンプルカテゴリー1 | サンプルサイト, test</title>' );
            } );
        } );
    } );
} );


function prepareTestFiles(){
    var shell = require( "shelljs" );

    removeTestFiles();

    shell.mkdir( TEMP_DIR );

    shell.cp(
        "-r",
        path.resolve( "./sample/htdocs/*" ),
        path.resolve( TEMP_DIR, "htdocs_utf8_update" )
    );

    shell.cp(
        "-r",
        path.resolve( "./sample/htdocs/__boilerplate.html" ),
        path.resolve( TEMP_DIR, "htdocs_utf8_generate" )
    );

    shell.cp(
        "-r",
        path.resolve( "./sample/htdocs_sjis/*" ),
        path.resolve( TEMP_DIR, "htdocs_sjis_update" )
    );

    shell.cp(
        "-r",
        path.resolve( "./sample/htdocs_sjis/__boilerplate.html" ),
        path.resolve( TEMP_DIR, "htdocs_sjis_generate" )
    );
}

function removeTestFiles(){
    require( "shelljs" ).rm( "-rf", TEMP_DIR )
}

