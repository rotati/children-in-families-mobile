var gulp       = require('gulp');
var gutil      = require('gulp-util');
var bower      = require('bower');
var concat     = require('gulp-concat');
var rename     = require('gulp-rename');
var sh         = require('shelljs');
var args       = require('yargs').argv;
var fs         = require('fs');
var replace    = require('gulp-replace-task');
var sass       = require('gulp-sass');
var minifyCss  = require('gulp-cssnano');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('replace', function () {
  var env = args.env || 'development';

  var filename = env + '.json';
  var settings = JSON.parse(fs.readFileSync('./config/' + filename, 'utf8'));

  gulp.src('./config/constants.js')
  .pipe(replace({
    patterns: [
      {
        match: 'localDB',
        replacement: settings.localDB
      }
    ]
  }))
  .pipe(replace({
    patterns: [
      {
        match: 'remoteDB',
        replacement: settings.remoteDB
      }
    ]
  }))
  .pipe(replace({
    patterns: [
      {
        match: 'changeLogDB',
        replacement: settings.changeLogDB
      }
    ]
  }))
  .pipe(replace({
    patterns: [
      {
        match: 'host',
        replacement: settings.host
      }
    ]
  }))
  .pipe(gulp.dest('./www/js/constants'));
});


gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
