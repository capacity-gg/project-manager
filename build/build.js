require('./check-versions')()

process.env.NODE_ENV = 'production';

//save to config when compiled
var config = require('../config');
var configName = ("build");
config[configName].env.NODE_ENV = JSON.stringify(process.env.NODE_ENV);

var ora = require('ora');
var rm = require('rimraf');
var path = require('path');
var chalk = require('chalk');
var webpack = require('webpack');
var config = require('../config');
var webpackConfig = require('./webpack.prod.conf');

var spinner = ora('building ' + (process.argv[2] ? ('[' + process.argv[2] + ']') : '[?]') + ' in production mode...');
spinner.start();

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) { throw err; }

  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) { throw err; }

    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n');

    if (err || (stats && stats.compilation && stats.compilation.errors && stats.compilation.errors.length > 0)) {
        console.log(chalk.bgYellow("Build may be be incomplete due to error(s)"));
        throw new Error('webpack build failed'); //ensure exit code is not of success
    }
    else {
        console.log(chalk.cyan('Build complete.\n'))
        console.log(chalk.green('Built ' + (process.argv[2] ? ('['+process.argv[2] + ']') : '[?]') + ' in production mode.\n'));
        console.log(chalk.yellow(
          'Tip: built files are meant to be served over an HTTP server.\n' +
          'Opening index.html over file:// won\'t work.\n'
        ));
    }
  })
})
