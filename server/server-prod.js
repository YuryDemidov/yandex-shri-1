import path from 'path';
import express from 'express';
const createPageData = require(`./data-processing.js`);

const app = express();
const DIST_DIR = __dirname;
const INDEX_FILE = path.join(DIST_DIR, `index.pug`);

app.use(express.static(DIST_DIR));
app.set(`view engine`, `pug`);
app.set('views', path.join(__dirname, `../src/views`));

app.get(`/`, (req, res) => {
  const data = createPageData(req.query.theme, req.query.slide);

  app.render(INDEX_FILE, data, (err, result) => {
    res.set(`content-type`, `text/html`);
    res.send(result);
    res.end();
  });
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening to ${PORT}....`);
  console.log(`Press Ctrl+C to quit.`);
});
