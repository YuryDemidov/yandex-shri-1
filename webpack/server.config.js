const path = require(`path`);
const nodeExternals = require(`webpack-node-externals`);

module.exports = () => {
  const SERVER_PATH = (process.env.NODE_ENV === `development`) ? `./server/server-dev.js` : `./server/server-prod.js`

  return ({
    entry: {
      server: SERVER_PATH,
    },
    output: {
      path: path.join(__dirname, `../build`),
      publicPath: `/`,
      filename: `[name].js`
    },
    mode: process.env.NODE_ENV,
    target: `node`,
    node: {
      // Need this when working with express, otherwise the build fails
      __dirname: false,   // if you don`t put this is, __dirname
      __filename: false,  // and __filename return blank or /
    },
    externals: [nodeExternals()], // Need this to avoid error when working with Express
    module: {
      rules: [
        {
          // Transpiles ES6-8 into ES5
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: `babel-loader`
          }
        }
      ]
    }
  })
}
