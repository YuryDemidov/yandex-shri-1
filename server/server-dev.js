import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
const config = require(`../webpack/dev.config.js`);
const createPageData = require(`./data-processing.js`);

const app = express();
const INDEX_FILE = path.join(__dirname, `index.pug`);
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  writeToDisk: filePath => /\.pug$/.test(filePath)
}));

app.use(webpackHotMiddleware(compiler));
app.set(`view engine`, `pug`);
app.set('views', path.join(__dirname, `../src/views`));

app.get(`/`, (req, res, next) => {
  const data = createPageData(req.query.theme, req.query.slide);

  app.render(INDEX_FILE, data, (err, result) => {
    if (err) {
      return next(err);
    }
    res.set(`content-type`, `text/html`);
    res.send(result);
    res.end();
  });
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log(`Press Ctrl+C to quit.`)
})
