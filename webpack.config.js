module.exports = ({ MODE, ...env }) => {
  const makeOptionFn = require(`./config/webpack.${MODE}.js`);
  return makeOptionFn(env);
};
