'use strict';

exports.name = 'copy';

/**
 * @param api {import('poi')}
 * @param options
 */
exports.apply = (api, { patterns, options } = {}) => {
  api.hook('createWebpackChain', config => {
    config
      .plugin('copy')
      .use(require('copy-webpack-plugin'), [patterns, options]);
  });
};
