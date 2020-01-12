var gulp = require('gulp'),
    htmlmin = require('gulp-htmlmin'),
    sass = require('gulp-ruby-sass'),
    del = require('del'),  // 文件删除
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-clean-css'),
    // jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    plumber = require('gulp-plumber'),
    livereload = require('gulp-livereload'),
    browserSync = require('browser-sync'),
    cached = require('gulp-cached'),
    runSequence = require('run-sequence'),
    spritesmith = require('gulp.spritesmith'),
    // webpack = require('webpack'),
    // webpackConfig = require('./webpack.config.js'),
    fileinclude  = require('gulp-file-include');

 // /*文件路径替换*/
var rev = require('gulp-rev');                                  //- 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector');               //- 路径替换
var assetRev = require('gulp-asset-rev');
var htmlreplace = require('gulp-html-replace');
// var myDevConfig = Object.create(webpackConfig);
// var devCompiler = webpack(myDevConfig);

//引用webpack对js进行操作
// gulp.task("build-js", function(callback) {
//     devCompiler.run(function(err, stats) {
//         if(err) throw new gutil.PluginError("webpack:build-js", err);
//         gutil.log("[webpack:build-js]", stats.toString({
//             colors: true
//         }));
//         callback();
//     });
//     browserSync.reload({ stream: true });
// });

gulp.task('liancss', function() { 
    gulp.src(['./src/css/reset.css','./src/css/sponsor.css']) 
    //.pipe(cached('css')) 
    .pipe(plumber()) //plumber给pipe打补丁
    .pipe(autoprefixer()) 
    .pipe(concat('sponsor.css')) 
    .pipe(minifycss()) 
    .pipe(assetRev())
    .pipe(gulp.dest('./dist/css')) 
    .pipe(notify({ message: 'sponsor base task complete' })) 
    .pipe(browserSync.reload({ stream: true }))

    gulp.src(['./src/css/reset.css','./src/css/lianlian.css']) 
    //.pipe(cached('css')) 
    .pipe(plumber()) //plumber给pipe打补丁
    .pipe(autoprefixer()) 
    .pipe(concat('lianlian.css')) 
    .pipe(minifycss()) 
    .pipe(assetRev())
    // .pipe(rename({suffix: '.min'})) 
    .pipe(gulp.dest('./dist/css')) 
    .pipe(notify({ message: 'lianlian base task complete' })) 
    .pipe(browserSync.reload({ stream: true }))

    gulp.src(['./src/css/reset.css','./src/css/index.css']) 
    //.pipe(cached('css')) 
    .pipe(plumber()) //plumber给pipe打补丁
    .pipe(autoprefixer()) 
    .pipe(concat('index.css')) 
    .pipe(minifycss()) 
    .pipe(assetRev())
    // .pipe(rename({suffix: '.min'})) 
    .pipe(gulp.dest('./dist/css')) 
    .pipe(notify({ message: 'index base task complete' })) 
    .pipe(browserSync.reload({ stream: true }))

    gulp.src(['./src/css/reset.css','./src/css/common.css']) 
    //.pipe(cached('css')) 
    .pipe(plumber()) //plumber给pipe打补丁
    .pipe(autoprefixer()) 
    .pipe(concat('common.css')) 
    .pipe(minifycss()) 
    .pipe(assetRev())
    // .pipe(rename({suffix: '.min'})) 
    .pipe(gulp.dest('./dist/css')) 
    .pipe(notify({ message: 'common base task complete' })) 
    .pipe(browserSync.reload({ stream: true }))
});

var options = {
    removeComments: true,//清除HTML注释
    collapseWhitespace: true,//压缩HTML
    // collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
    // removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
    // removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
    minifyJS: true,//压缩页面JS
    minifyCSS: true//压缩页面CSS
};

gulp.task('fileinclude', function() {
    // 适配page中所有文件夹下的所有html，排除page下的include文件夹中html
    gulp.src(['src/html/**/*.html','!src/html/include/**.html'])
        .pipe(fileinclude({
          prefix: '@@'
        }))
        .pipe(plumber()) //plumber给pipe打补丁
        .pipe(htmlreplace({
            'lianlian': '../../css/lianlian.css',
            'index': '../../css/index.css',
            'sponsor': '../../css/sponsor.css',
            'common': '../../css/common.css',
        }))
        .pipe(assetRev())
    .pipe(htmlmin(options))
    .pipe(gulp.dest('dist/pages'))
    .pipe(notify({ message: 'fileinclude base task complete' })) ;

    gulp.src(['src/index.html'])
        .pipe(fileinclude({
          prefix: '@@'
        }))
        .pipe(plumber()) //plumber给pipe打补丁
        .pipe(htmlreplace({
            'index': './css/index.css',
        }))
        .pipe(assetRev())
    .pipe(htmlmin(options))
    .pipe(gulp.dest('dist/'))
    .pipe(notify({ message: 'fileinclude index task complete' })) ;

	gulp.src(['src/favicon.ico']).pipe(gulp.dest('dist/'))
	.pipe(notify({ message: 'favicon ico task complete' })) ;
});

gulp.task('image', function() {
  return gulp.src('src/images/**/*.{jpg,jpeg,png,gif}')
    .pipe(cached('image'))
    .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true, multipass: true}))
    // 取值范围：0-7（优化等级）,是否无损压缩jpg图片，是否隔行扫描gif进行渲染，是否多次优化svg直到完全优化
    .pipe(gulp.dest('dist/images/'))
});

gulp.task('font', function() {
  return gulp.src('src/font/*')
        .pipe(gulp.dest('dist/font/'))
});

// clean 清空 dist 目录
gulp.task('clean', function() {
  return del('dist/**/*');
});

// build，关连执行全部编译任务
gulp.task('build', [ 'fileinclude','liancss', 'image', 'font'], function () {
  // gulp.start('fileinclude');
});
 
// default 默认任务，依赖清空任务
gulp.task('default', ['clean','watch','build'], function() {
  // gulp.start('build');
});

gulp.task('watch',function (){ 
    browserSync.init({
        server: {
          baseDir: 'dist' // 在 dist 目录下启动本地服务器环境，自动启动默认浏览器
        },
        // proxy: "127.0.0.1:5555",
        debug: true
    });
    gulp.watch('src/html/**/*.html', ['fileinclude']);
    gulp.watch('src/css/*.css', ['liancss']);
    gulp.watch('src/css/**/*.css', ['liancss']); 
    gulp.watch('src/images/**/*', ['image']);
    
    gulp.watch(['dist/**/*', '!dist/css/*']).on('change', browserSync.reload);
});

// gulp.task('default', function (callback) { 
//     runSequence([ 'liancss', 'build-js', 'watch'], callback ) 
// })


// /*text gulp */
// var argv = require('yargs').argv,

//    _ = require('lodash'),

//    path = require('path');


// gulp.task('help',function () {

//   console.log('	gulp build			文件打包');

//   console.log('	gulp watch			文件监控打包');

//   console.log('	gulp help			gulp参数说明');

//   console.log('	gulp server			测试server');

//   console.log('	gulp -p				生产环境（默认生产环境）');

//   console.log('	gulp -d				开发环境');

//   console.log('	gulp -m <module>		部分模块打包（默认全部打包）');

// });

// /* 默认 */

// gulp.task('default',function () {

//   gulp.start('help');

// });

// gulp.task('build', function() {  
// 	var evr = argv.p || !argv.d; //生产环境为true，开发环境为false，默认为true

// 	var mod = argv.m || 'all';//模块明，默认为全部
    
// });



// gulp.task('concat', function() {                                //- 创建一个名为 concat 的 task
//     gulp.src(['./public/src/css/base.css', './public/src/css/bhu.css'])    //- 需要处理的css文件，放到一个字符串数组里
//         .pipe(concat('wap.min.css'))                            //- 合并后的文件名
//         .pipe(minifycss())                                      //- 压缩处理成一行
//         .pipe(rev())                                            //- 文件名加MD5后缀
//         .pipe(gulp.dest('./public/css'))                        //- 将 rev-manifest.json 保存到 rev 目录内
// 		.pipe(rev.manifest())                                   //- 生成一个rev-manifest.json
//         .pipe(gulp.dest('./rev'));                              //- 将 rev-manifest.json 保存到 rev 目录内

// });


// gulp.task('rev', function() {
//     gulp.src(['./rev/*.json', './resources/views/Home/Common/head.blade.php', './resources/views/Home/Common/foot.blade.php'])   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
//         .pipe(revCollector())                                   //- 执行文件内css名的替换
//         .pipe(gulp.dest('./application/'));                     //- 替换后的文件输出的目录
// });

// gulp.task('default', ['concat', 'rev']);





