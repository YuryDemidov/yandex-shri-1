const webpack = require(`webpack`);
const { merge } = require(`webpack-merge`);
const baseWebpackConfig = require(`./base.config`);

const devWebpackConfig = merge(baseWebpackConfig, {
  // DEV config
  mode: `development`,
  devtool: `eval-cheap-source-map`,
  devServer: {
    contentBase: baseWebpackConfig.externals.paths.build,
    port: 8080,
    hot: true,
    overlay: {
      warnings: false,
      errors: true
    }
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: `[file].map`
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
});

module.exports = devWebpackConfig;
