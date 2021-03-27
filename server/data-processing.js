const fs = require(`fs`);
const path = require(`path`);

module.exports = (theme, slideNumber = 1) => {
  const data = fs.readFileSync(path.join(__dirname, `../data/data.json`));
  const slides = JSON.parse(data);

  return {
    pageData: {
      theme,
      slide: slides[slideNumber - 1]
    }
  };
}
