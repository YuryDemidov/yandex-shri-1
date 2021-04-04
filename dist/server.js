/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./server/data-processing.js":
/*!***********************************!*\
  !*** ./server/data-processing.js ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var fs = __webpack_require__(/*! fs */ \"fs\");\n\nvar path = __webpack_require__(/*! path */ \"path\");\n\nmodule.exports = function (theme) {\n  var slideNumber = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;\n  var data = fs.readFileSync(path.join(__dirname, \"../data/data.json\"));\n  var slides = JSON.parse(data);\n  return {\n    pageData: {\n      theme: theme,\n      slide: slides[slideNumber - 1]\n    }\n  };\n};\n\n//# sourceURL=webpack://yandex-shri/./server/data-processing.js?");

/***/ }),

/***/ "./server/server-dev.js":
/*!******************************!*\
  !*** ./server/server-dev.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var webpack__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! webpack */ \"webpack\");\n/* harmony import */ var webpack__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(webpack__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var webpack_dev_middleware__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! webpack-dev-middleware */ \"webpack-dev-middleware\");\n/* harmony import */ var webpack_dev_middleware__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(webpack_dev_middleware__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var webpack_hot_middleware__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! webpack-hot-middleware */ \"webpack-hot-middleware\");\n/* harmony import */ var webpack_hot_middleware__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(webpack_hot_middleware__WEBPACK_IMPORTED_MODULE_4__);\n\n\n\n\n\n\nvar config = __webpack_require__(/*! ../webpack/dev.config.js */ \"./webpack/dev.config.js\");\n\nvar createPageData = __webpack_require__(/*! ./data-processing.js */ \"./server/data-processing.js\");\n\nvar app = express__WEBPACK_IMPORTED_MODULE_1___default()();\nvar INDEX_FILE = path__WEBPACK_IMPORTED_MODULE_0___default().join(__dirname, \"index.pug\");\nvar compiler = webpack__WEBPACK_IMPORTED_MODULE_2___default()(config);\napp.use(webpack_dev_middleware__WEBPACK_IMPORTED_MODULE_3___default()(compiler, {\n  publicPath: config.output.publicPath,\n  writeToDisk: function writeToDisk(filePath) {\n    return /\\.pug$/.test(filePath);\n  }\n}));\napp.use(webpack_hot_middleware__WEBPACK_IMPORTED_MODULE_4___default()(compiler));\napp.set(\"view engine\", \"pug\");\napp.set('views', path__WEBPACK_IMPORTED_MODULE_0___default().join(__dirname, \"../src/views\"));\napp.get(\"/\", function (req, res, next) {\n  var data = createPageData(req.query.theme, req.query.slide);\n  app.render(INDEX_FILE, data, function (err, result) {\n    if (err) {\n      return next(err);\n    }\n\n    res.set(\"content-type\", \"text/html\");\n    res.send(result);\n    res.end();\n  });\n});\nvar PORT = process.env.PORT || 8080;\napp.listen(PORT, function () {\n  console.log(\"App listening to \".concat(PORT, \"....\"));\n  console.log(\"Press Ctrl+C to quit.\");\n});\n\n//# sourceURL=webpack://yandex-shri/./server/server-dev.js?");

/***/ }),

/***/ "./webpack/base.config.js":
/*!********************************!*\
  !*** ./webpack/base.config.js ***!
  \********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === \"undefined\" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === \"number\") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError(\"Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it[\"return\"] != null) it[\"return\"](); } finally { if (didErr) throw err; } } }; }\n\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\n\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\n\nvar path = __webpack_require__(/*! path */ \"path\");\n\nvar HtmlWebpackPlugin = __webpack_require__(/*! html-webpack-plugin */ \"html-webpack-plugin\");\n\nvar HtmlWebpackPugPlugin = __webpack_require__(/*! html-webpack-pug-plugin */ \"html-webpack-pug-plugin\");\n\nvar MiniCssExtractPlugin = __webpack_require__(/*! mini-css-extract-plugin */ \"mini-css-extract-plugin\");\n\nvar OptimizeCssAssetWebpackPlugin = __webpack_require__(/*! optimize-css-assets-webpack-plugin */ \"optimize-css-assets-webpack-plugin\");\n\nvar CopyWebpackPlugin = __webpack_require__(/*! copy-webpack-plugin */ \"copy-webpack-plugin\");\n\nvar TerserWebpackPlugin = __webpack_require__(/*! terser-webpack-plugin */ \"terser-webpack-plugin\");\n\nvar StylelintPlugin = __webpack_require__(/*! stylelint-webpack-plugin */ \"stylelint-webpack-plugin\");\n\nvar ESLintPlugin = __webpack_require__(/*! eslint-webpack-plugin */ \"eslint-webpack-plugin\");\n\nvar _require = __webpack_require__(/*! webpack-bundle-analyzer */ \"webpack-bundle-analyzer\"),\n    BundleAnalyzerPlugin = _require.BundleAnalyzerPlugin; // Setting development flag via Node JS\n\n\nvar isDev = \"development\" === \"development\";\nvar PATHS = {\n  src: path.join(__dirname, \"../src\"),\n  dist: path.join(__dirname, \"../dist\"),\n  assets: \"assets\"\n}; // TODO Turn on contenthash in production. Was turned off for testing\n// const filename = (dir, ext) => isDev ? `${dir}[name].${ext}` : `${dir}[name].[contenthash:8].${ext}`;\n\nvar filename = function filename(dir, ext) {\n  return \"\".concat(dir, \"[name].\").concat(ext);\n};\n\nvar mainEntryPoint = function mainEntryPoint() {\n  var base = [\"./src/js/stories.js\"];\n\n  if (isDev) {\n    base.unshift(\"webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000\");\n  }\n\n  return base;\n};\n\nvar plugins = function plugins() {\n  var base = [new CopyWebpackPlugin({\n    patterns: [{\n      from: \"\".concat(PATHS.assets, \"/images\"),\n      to: \"\".concat(PATHS.assets, \"/images\")\n    }]\n  }), new HtmlWebpackPlugin({\n    filename: \"./index.pug\",\n    minify: false,\n    // Files will be minified by pug template engine while rendering with express js\n    inject: \"head\",\n    scriptLoading: \"blocking\",\n    template: \"./src/views/index.pug\"\n  }), new HtmlWebpackPlugin({\n    filename: \"./svg-sprite-light.pug\",\n    minify: false,\n    template: \"./src/views/svg-sprite-light.pug\"\n  }), new HtmlWebpackPlugin({\n    filename: \"./svg-sprite-dark.pug\",\n    minify: false,\n    template: \"./src/views/svg-sprite-dark.pug\"\n  }), new HtmlWebpackPugPlugin(), new MiniCssExtractPlugin({\n    filename: \"stories.css\"\n  }), new StylelintPlugin({\n    context: path.resolve(__dirname, \"\".concat(PATHS.src, \"/scss\")),\n    syntax: \"scss\",\n    emitErrors: false\n  }), new ESLintPlugin()];\n\n  if (!isDev) {\n    base.push(new BundleAnalyzerPlugin());\n  }\n\n  return base;\n};\n\nvar cssLoaders = function cssLoaders() {\n  var loaders = [{\n    loader: MiniCssExtractPlugin.loader\n  }, {\n    loader: \"css-loader\",\n    options: {\n      sourceMap: true\n    }\n  }, {\n    loader: \"postcss-loader\",\n    options: {\n      postcssOptions: {\n        config: path.resolve(__dirname, \"../postcss.config.js\")\n      },\n      sourceMap: true\n    }\n  }];\n\n  for (var _len = arguments.length, extras = new Array(_len), _key = 0; _key < _len; _key++) {\n    extras[_key] = arguments[_key];\n  }\n\n  if (extras) {\n    var _iterator = _createForOfIteratorHelper(extras),\n        _step;\n\n    try {\n      for (_iterator.s(); !(_step = _iterator.n()).done;) {\n        var loader = _step.value;\n        loaders.push(loader);\n      }\n    } catch (err) {\n      _iterator.e(err);\n    } finally {\n      _iterator.f();\n    }\n  }\n\n  return loaders;\n};\n\nvar babelOptions = function babelOptions(preset, plugin) {\n  var opts = {\n    presets: [[\"@babel/preset-env\", {\n      useBuiltIns: \"usage\",\n      corejs: 3.9\n    }]]\n  };\n\n  if (preset) {\n    opts.presets.push(preset);\n  }\n\n  if (plugin) {\n    opts.plugins.push(plugin);\n  }\n\n  return opts;\n};\n\nvar jsLoaders = function jsLoaders() {\n  var loaders = [{\n    loader: \"babel-loader\",\n    options: babelOptions()\n  }];\n  return loaders;\n};\n\nvar optimization = function optimization() {\n  var config = {\n    runtimeChunk: \"single\",\n    splitChunks: {\n      cacheGroups: {\n        vendor: {\n          name: \"vendor\",\n          test: /node_modules/,\n          chunks: \"all\",\n          enforce: true\n        }\n      }\n    }\n  };\n\n  if (!isDev) {\n    config.minimizer = [new OptimizeCssAssetWebpackPlugin(), new TerserWebpackPlugin({\n      terserOptions: {\n        parse: {\n          // we want terser to parse ecma 8 code. However, we don`t want it\n          // to apply any minification steps that turns valid ecma 5 code\n          // into invalid ecma 5 code. This is why the `compress` and `output`\n          // sections only apply transformations that are ecma 5 safe\n          // https://github.com/facebook/create-react-app/pull/4234\n          ecma: 8\n        },\n        compress: {\n          ecma: 5,\n          warnings: false,\n          // Disabled because of an issue with Uglify breaking seemingly valid code:\n          // https://github.com/facebook/create-react-app/issues/2376\n          // Pending further investigation:\n          // https://github.com/mishoo/UglifyJS2/issues/2011\n          comparisons: false\n        },\n        mangle: true,\n        output: {\n          ecma: 5,\n          comments: false,\n          // Turned on because emoji and regex is not minified properly using default\n          // https://github.com/facebook/create-react-app/issues/2488\n          ascii_only: true\n        }\n      }\n    })];\n  }\n\n  return config;\n};\n\nvar imageOptimOptions = function imageOptimOptions(ext) {\n  switch (ext) {\n    case \"png\":\n      return {\n        optipng: {\n          optimizationLevel: 4\n        }\n      };\n\n    case \"jpg\":\n    case \"jpeg\":\n      return {\n        mozjpeg: {\n          progressive: true,\n          quality: 80\n        }\n      };\n\n    case \"webp\":\n      return {\n        webp: {\n          quality: 70\n        }\n      };\n\n    case \"svg\":\n      return {\n        svgo: {}\n      };\n\n    default:\n      break;\n  }\n};\n\nmodule.exports = {\n  externals: {\n    paths: PATHS\n  },\n  entry: {\n    stories: mainEntryPoint()\n  },\n  output: {\n    filename: filename(\"\", \"js\"),\n    path: PATHS.dist,\n    publicPath: \"/\"\n  },\n  optimization: optimization(),\n  plugins: plugins(),\n  target: \"web\",\n  module: {\n    rules: [{\n      test: /\\.html$/,\n      use: [{\n        loader: \"html-loader\"\n      }]\n    }, {\n      test: /\\.js$/,\n      exclude: /node_modules/,\n      use: jsLoaders()\n    }, {\n      test: /\\.css$/,\n      use: cssLoaders()\n    }, {\n      test: /\\.s[ac]ss$/,\n      use: cssLoaders({\n        loader: \"resolve-url-loader\"\n      }, {\n        loader: \"sass-loader\",\n        options: {\n          sourceMap: true\n        }\n      })\n    }, {\n      test: /\\.(woff(2)?|ttf|eot)$/,\n      use: [{\n        loader: \"file-loader\",\n        options: {\n          name: filename(\"\".concat(PATHS.assets, \"/fonts/\"), \"[ext]\"),\n          esModule: false\n        }\n      }]\n    }, {\n      test: /\\.(webp|png|jpe?g|svg)$/,\n      use: [{\n        loader: \"file-loader\",\n        options: {\n          name: filename(\"\", \"[ext]\"),\n          outputPath: function outputPath(url, resourcePath, context) {\n            return path.relative(context, resourcePath);\n          },\n          esModule: false\n        }\n      }]\n    }, {\n      test: /\\.(mp4|ogv|webm)$/,\n      loader: \"file-loader\",\n      options: {\n        outputPath: function outputPath(url, resourcePath, context) {\n          return path.relative(context, resourcePath);\n        },\n        name: filename(\"\", \"[ext]\")\n      }\n    }, {\n      test: /\\.xml$/,\n      loader: \"xml-loader\"\n    }]\n  }\n};\n\n//# sourceURL=webpack://yandex-shri/./webpack/base.config.js?");

/***/ }),

/***/ "./webpack/dev.config.js":
/*!*******************************!*\
  !*** ./webpack/dev.config.js ***!
  \*******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var webpack = __webpack_require__(/*! webpack */ \"webpack\");\n\nvar _require = __webpack_require__(/*! webpack-merge */ \"webpack-merge\"),\n    merge = _require.merge;\n\nvar baseWebpackConfig = __webpack_require__(/*! ./base.config */ \"./webpack/base.config.js\");\n\nvar devWebpackConfig = merge(baseWebpackConfig, {\n  // DEV config\n  mode: \"development\",\n  devtool: \"eval-cheap-source-map\",\n  plugins: [new webpack.SourceMapDevToolPlugin({\n    filename: \"[file].map\"\n  }), new webpack.HotModuleReplacementPlugin(), new webpack.NoEmitOnErrorsPlugin()]\n});\nmodule.exports = devWebpackConfig;\n\n//# sourceURL=webpack://yandex-shri/./webpack/dev.config.js?");

/***/ }),

/***/ "copy-webpack-plugin":
/*!**************************************!*\
  !*** external "copy-webpack-plugin" ***!
  \**************************************/
/***/ ((module) => {

"use strict";
module.exports = require("copy-webpack-plugin");;

/***/ }),

/***/ "eslint-webpack-plugin":
/*!****************************************!*\
  !*** external "eslint-webpack-plugin" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("eslint-webpack-plugin");;

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("express");;

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ "html-webpack-plugin":
/*!**************************************!*\
  !*** external "html-webpack-plugin" ***!
  \**************************************/
/***/ ((module) => {

"use strict";
module.exports = require("html-webpack-plugin");;

/***/ }),

/***/ "html-webpack-pug-plugin":
/*!******************************************!*\
  !*** external "html-webpack-pug-plugin" ***!
  \******************************************/
/***/ ((module) => {

"use strict";
module.exports = require("html-webpack-pug-plugin");;

/***/ }),

/***/ "mini-css-extract-plugin":
/*!******************************************!*\
  !*** external "mini-css-extract-plugin" ***!
  \******************************************/
/***/ ((module) => {

"use strict";
module.exports = require("mini-css-extract-plugin");;

/***/ }),

/***/ "optimize-css-assets-webpack-plugin":
/*!*****************************************************!*\
  !*** external "optimize-css-assets-webpack-plugin" ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("optimize-css-assets-webpack-plugin");;

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ }),

/***/ "stylelint-webpack-plugin":
/*!*******************************************!*\
  !*** external "stylelint-webpack-plugin" ***!
  \*******************************************/
/***/ ((module) => {

"use strict";
module.exports = require("stylelint-webpack-plugin");;

/***/ }),

/***/ "terser-webpack-plugin":
/*!****************************************!*\
  !*** external "terser-webpack-plugin" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("terser-webpack-plugin");;

/***/ }),

/***/ "webpack":
/*!**************************!*\
  !*** external "webpack" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("webpack");;

/***/ }),

/***/ "webpack-bundle-analyzer":
/*!******************************************!*\
  !*** external "webpack-bundle-analyzer" ***!
  \******************************************/
/***/ ((module) => {

"use strict";
module.exports = require("webpack-bundle-analyzer");;

/***/ }),

/***/ "webpack-dev-middleware":
/*!*****************************************!*\
  !*** external "webpack-dev-middleware" ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("webpack-dev-middleware");;

/***/ }),

/***/ "webpack-hot-middleware":
/*!*****************************************!*\
  !*** external "webpack-hot-middleware" ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("webpack-hot-middleware");;

/***/ }),

/***/ "webpack-merge":
/*!********************************!*\
  !*** external "webpack-merge" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("webpack-merge");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./server/server-dev.js");
/******/ 	
/******/ })()
;