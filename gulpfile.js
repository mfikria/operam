const webpack = require('webpack-stream');
const gulp = require('gulp');

gulp.task('build', () =>
    gulp.src('index.js')
        .pipe(webpack({
          entry: './client.js',
          output: {
            library: 'operam',
            filename: 'operam.js'
          },
          externals: {
            global: 'typeof self !== "undefined" ? self : ' +
                'typeof window !== "undefined" ? window : ' +
                'typeof global !== "undefined" ? global : {}'
          },
          module: {
            loaders: [
              {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                  presets: ['es2015']
                }
              }
            ]
          }
        }))
        .pipe(gulp.dest('build'))
);
