const fs = require('fs');
const path = require('path');
const SVGO = require('svgo'); // eslint-disable-line import/no-extraneous-dependencies
const sharp = require('sharp'); // eslint-disable-line import/no-extraneous-dependencies

module.exports = () => new Promise(async (resolve) => {
  const svgString = await new Promise((res) => {
    fs.readFile(path.join(__dirname, '..', '..', 'src', 'assets', 'logo.source.svg'), {
      encoding: 'utf8',
    }, (e, d) => {
      res(d);
    });
  });
  const optSvg = new SVGO();
  const optimzedSvg = await optSvg.optimize(svgString);

  const svgPath = path.join(__dirname, '..', '..', 'src', 'assets', 'logo.svg');

  await new Promise((res) => {
    fs.writeFile(svgPath, optimzedSvg.data, () => {
      res();
    });
  });

  const iconSpecs = {
    'android-chrome-192x192': 192,
    'android-chrome-512x512': 512,
    'apple-touch-icon-60x60': 60,
    'apple-touch-icon-76x76': 76,
    'apple-touch-icon-120x120': 120,
    'apple-touch-icon-152x152': 152,
    'apple-touch-icon-180x180': 180,
    'apple-touch-icon': 180,
    'favicon-16x16': 16,
    'favicon-32x32': 32,
    'msapplication-icon-144x144': 144,
    'mstile-150x150': 150,
  };
  const promises = [];
  Object.keys(iconSpecs).forEach((name) => {
    const size = iconSpecs[name];
    const destPath = path.join(__dirname, '..', '..', 'src', 'assets', `${name}.png`);
    if (name.match(/apple/)) {
      promises.push(sharp(svgPath, {
        density: 600,
      }).resize(size, size).flatten({
        background: {
          r: 255, g: 255, b: 255, alpha: 1,
        },
      }).png()
        .toFile(destPath));
    } else {
      promises.push(sharp(svgPath, {
        density: 600,
      }).resize(size, size).png().toFile(destPath));
    }
  });

  promises.push(new Promise((res) => {
    const destPath = path.join(__dirname, '..', '..', 'src', 'assets', 'safari-pinned-tab');
    fs.copyFile(svgPath, destPath, () => {
      res();
    });
  }));

  await Promise.all(promises);

  resolve();
});
