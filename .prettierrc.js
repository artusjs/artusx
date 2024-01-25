// Documentation for this file: https://prettier.io/en/configuration.html

module.exports = {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  singleQuote: true,

  // We use a larger print width because Prettier's word-wrapping seems to be tuned
  // for plain JavaScript without type annotations
  printWidth: 110,

  // Use .gitattributes to manage newlines
  endOfLine: 'lf',
  plugins: ['./common/autoinstallers/rush-prettier/node_modules/prettier-plugin-packagejson'],
};
