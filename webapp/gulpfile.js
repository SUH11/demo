var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var open = require('open');

var app = {
    srcPath : 'src/',
    devPath : 'build/',
    prdPath : 'dist/'
};

gulp.task('lib', function() {
    // 读取所有的js文件
    gulp.src('bower_components/**/*.js')
    // 拷贝文件
    .pipe(gulp.dest(app.devPath + 'vendor'))
    .pipe(gulp.dest(app.prdPath + 'vendor'))
    // 浏览器自动刷新
    .pipe($.connect.reload());
});

// 将html文件拷贝到build 和dist目录下
gulp.task('html', function() {
    gulp.src(app.srcPath + '**/*.html')
    .pipe(gulp.dest(app.devPath))
    .pipe(gulp.dest(app.prdPath))
    .pipe($.connect.reload());
});

gulp.task('json', function() {
    // 读取所有的js文件
    gulp.src(app.srcPath + 'data/**/*.json')
    // 拷贝文件
    .pipe(gulp.dest(app.devPath + 'data'))
    .pipe(gulp.dest(app.prdPath + 'data'))
    .pipe($.connect.reload());
});

gulp.task('less', function() {
    gulp.src(app.srcPath + 'style/index.less')
    .pipe($.plumber())
    // 编译less文件
    .pipe($.less())
    // 然后拷到这个目录下
    .pipe(gulp.dest(app.devPath + 'css'))
    // 将编译好的文件，通过压缩的方式，
    .pipe($.cssmin())
    // 拷贝到这个文件下
    .pipe(gulp.dest(app.prdPath + 'css'))
    .pipe($.connect.reload());
});

gulp.task('js', function() {
    gulp.src(app.srcPath + 'script/**/*.js')
    .pipe($.plumber())
    // 合并js代码
    .pipe($.concat('index.js'))
    .pipe(gulp.dest(app.devPath + 'js'))
    // 压缩js代码
    .pipe($.uglify())
    .pipe(gulp.dest(app.prdPath + 'js'))
    .pipe($.connect.reload());
});

gulp.task('image', function() {
    gulp.src(app.srcPath + 'image/**/*')
    .pipe($.plumber())
    .pipe(gulp.dest(app.devPath + 'image'))
    .pipe($.imagemin())
    .pipe(gulp.dest(app.prdPath + 'image'))
    .pipe($.connect.reload());
});

// 清除
gulp.task('clean', function() {
    gulp.src([app.devPath, app.prdPath])
    .pipe($.clean())
    .pipe($.connect.reload());
});

// 总任务
gulp.task('build', ['lib', 'html', 'json', 'less', 'js', 'image']);

// 服务任务
gulp.task('serve', ['build'], function() {
    $.connect.server({
        root : [app.devPath], 
        livereload : true,
        port : 3000
    });

    open('http://localhost:3000');

    // 自动构建
    gulp.watch('bower_components/**/*', ['lib']);
    gulp.watch(app.srcPath + '**/*', ['html']);
    gulp.watch(app.srcPath + 'data/**/*.json', ['json']);
    gulp.watch(app.srcPath + 'style/**/*.less', ['less']);
    gulp.watch(app.srcPath + 'script/**/*.js', ['js']);
    gulp.watch(app.srcPath + 'image/**/*', ['image']);

});

gulp.task('default', ['serve']);