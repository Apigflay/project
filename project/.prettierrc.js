module.exports = {
  tabWidth: 2,
  printWidth: 120,
  semi: false, //分号
  singleQuote: true, //单引号
  trailingComma: 'all', //结尾逗号
  proseWrap: 'never',
  endOfLine: 'lf',
  overrides: [
    {
      files: '.prettierrc',
      options: {
        parser: 'json',
      },
    },
    {
      files: 'document.ejs',
      options: {
        parser: 'html',
      },
    },
  ],
}
