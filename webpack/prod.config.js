const { merge } = require(`webpack-merge`);
const baseWebpackConfig = require(`./base.config`);

const prodWebpackConfig = merge(baseWebpackConfig, {
  // BUILD config
  mode: `production`,
  plugins: []
});

module.exports = prodWebpackConfig;
