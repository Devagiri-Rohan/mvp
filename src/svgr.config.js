// svgr.config.js
module.exports = {
    jsx: {
      babelConfig: {
        plugins: ['@svgr/babel-plugin-remove-jsx-namespace'],
      },
    },
  };
  