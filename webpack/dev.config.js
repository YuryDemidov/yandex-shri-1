const webpack = require(`webpack`);
const { merge } = require(`webpack-merge`);
const baseWebpackConfig = require(`./base.config`);

const devWebpackConfig = merge(baseWebpackConfig, {
  // DEV config
  mode: `development`,
  devtool: `eval-cheap-source-map`,
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: `[file].map`
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
});

module.exports = devWebpackConfig;
