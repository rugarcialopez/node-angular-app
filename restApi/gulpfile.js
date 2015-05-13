var gulp = require('gulp'),
    nodemon = require('nodemon');

var paths = {
  app: './',
  src: ['./*.txt', './config/*.js', './models/*.js', './routes/*.js', './validators/*.js']
};

gulp.task('start', function () {
  nodemon({
    script: 'server.js',
    ext: 'js txt',
    env: { 'NODE_ENV': 'development' }
  })
})

gulp.task('default', ['start']);
