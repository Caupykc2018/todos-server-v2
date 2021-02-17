module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        absoluteRuntime: false,
        corejs: false,
        helpers: true,
        regenerator: true,
        useESModules: false,
        version: '7.0.0-beta.0'
      }
    ],
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true
      }
    ],
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread'
  ]
};
