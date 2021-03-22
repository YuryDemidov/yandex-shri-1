const path = require(`path`);
const HTMLWebpackPlugin = require(`html-webpack-plugin`);
const MiniCssExtractPlugin = require(`mini-css-extract-plugin`);
const OptimizeCssAssetWebpackPlugin = require(`optimize-css-assets-webpack-plugin`);
const TerserWebpackPlugin = require(`terser-webpack-plugin`);
const StylelintPlugin = require(`stylelint-webpack-plugin`);
const ESLintPlugin = require('eslint-webpack-plugin');
const { BundleAnalyzerPlugin } = require(`webpack-bundle-analyzer`);

// Setting development flag via Node JS
const isDev = process.env.NODE_ENV === `development`;

const PATHS = {
  src: path.join(__dirname, `../src`),
  build: path.join(__dirname, `../build`),
  assets: `assets/`
};

const filename = (dir, ext) => isDev ? `${dir}[name].${ext}` : `${dir}[name].[contenthash:8].${ext}`;

const mainEntryPoint = () => {
  const base = [`./src/stories.js`];

  if (isDev) {
    base.unshift(`webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000`);
  }

  return base;
}

const plugins = () => {
  const base = [
    new HTMLWebpackPlugin({
      template: `./src/html/index.html`,
      filename: `./index.html`,
      excludeChunks: [`server`]
    }),

    new MiniCssExtractPlugin({
      filename: `stories.css`
    }),

    new StylelintPlugin({
      context: path.resolve(__dirname, `${PATHS.src}/scss`),
      syntax: `scss`,
      emitErrors: false
    }),

    new ESLintPlugin()
  ];

  if (!isDev) {
    base.push(new BundleAnalyzerPlugin());
  }

  return base;
};

const cssLoaders = (...extras) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader
    },
    {
      loader: `css-loader`,
      options: {
        sourceMap: true
      }
    },
    {
      loader: `postcss-loader`,
      options: {
        postcssOptions: {
          config: path.resolve(__dirname, `../postcss.config.js`)
        },
        sourceMap: true
      }
    }
  ];

  if (extras) {
    for (const loader of extras) {
      loaders.push(loader);
    }
  }

  return loaders;
};

const babelOptions = (preset, plugin) => {
  const opts = {
    presets: [
      [
        `@babel/preset-env`,
        {
          useBuiltIns: `usage`,
          corejs: 3.9
        }
      ]
    ]
  };

  if (preset) {
    opts.presets.push(preset);
  }
  if (plugin) {
    opts.plugins.push(plugin);
  }

  return opts;
};

const jsLoaders = () => {
  const loaders = [
    {
      loader: `babel-loader`,
      options: babelOptions()
    }
  ];

  return loaders;
};

const optimization = () => {
  const config = {
    runtimeChunk: `single`,
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: `vendor`,
          test: /node_modules/,
          chunks: `all`,
          enforce: true
        }
      }
    }
  };

  if (!isDev) {
    config.minimizer = [
      new OptimizeCssAssetWebpackPlugin(),
      new TerserWebpackPlugin({
        terserOptions: {
          parse: {
            // we want terser to parse ecma 8 code. However, we don`t want it
            // to apply any minification steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the `compress` and `output`
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false
          },
          mangle: true,
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true
          }
        }
      })
    ];
  }

  return config;
};

const imageOptimOptions = ext => {
  switch (ext) {
    case `png`:
      return {
        optipng: {
          optimizationLevel: 4
        }
      }
    case `jpg`:
    case `jpeg`:
      return {
        mozjpeg: {
          progressive: true,
          quality: 80
        }
      }
    case `webp`:
      return {
        webp: {
          quality: 70
        }
      }
    case `svg`:
      return {
        svgo: {}
      }
    default:
      break;
  }
}

module.exports = {
  externals: {
    paths: PATHS
  },
  entry: {
    main: mainEntryPoint()
  },
  output: {
    filename: filename(`js/`, `js`),
    path: PATHS.build,
    publicPath: `/`,
  },
  optimization: optimization(),
  plugins: plugins(),
  target: `web`,
  module: {
    rules: [{
      test: /\.html$/,
      use: [
        {
          loader: `html-loader`
        }
      ]
    }, {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders()
      }, {
        test: /\.css$/,
        use: cssLoaders()
      }, {
        test: /\.s[ac]ss$/,
        use: cssLoaders({
          loader: `resolve-url-loader`
        }, {
          loader: `sass-loader`,
          options: {
            sourceMap: true
          }
        })
      }, {
        test: /\.(woff(2)?|ttf|eot)$/,
        loader: `file-loader`,
        options: {
          name: filename(`fonts/`, `[ext]`),
          outputPath: PATHS.assets
        }
      }, {
        test: /\.(webp|png|jpe?g|svg)$/,
        use: [{
          loader: `file-loader`,
          options: {
            name: filename(``, `[ext]`),
            outputPath: (url, resourcePath, context) => path.relative(context, resourcePath),
            esModule: false
          }
        }, {
          loader: `image-webpack-loader`,
          options: imageOptimOptions(`[ext]`)
        }]
      }, {
        test: /\.(mp4|ogv|webm)$/,
        loader: `file-loader`,
        options: {
          outputPath: (url, resourcePath, context) => path.relative(context, resourcePath),
          name: filename(``, `[ext]`)
        }
      }, {
        test: /\.xml$/,
        loader: `xml-loader`
      }]
  }
};
