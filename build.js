const webpack = require('webpack');
const configFactory = require('./webpack.config.js');
const config = configFactory({ production: true });
config.mode = 'production';

console.log('Starting webpack production build...');
webpack(config, (err, stats) => {
  if (err) {
    console.error('Fatal Webpack Error:', err);
    process.exit(1);
  }

  const info = stats.toJson();

  if (stats.hasErrors()) {
    console.error('Compilation errors:');
    info.errors.forEach(e => console.error(e));
    process.exit(1);
  }

  if (stats.hasWarnings()) {
    console.warn('Compilation warnings:');
    info.warnings.forEach(w => console.warn(w));
  }

  console.log(stats.toString({
    chunks: false,
    colors: true,
    modules: false,
    children: false
  }));

  console.log('Webpack build completed successfully. Exiting process.');
  process.exit(0);
});
