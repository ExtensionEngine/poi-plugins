'use strict';

exports.name = 'clean';

/**
 * @param api {import('poi')}
 * @param options {import('clean-webpack-plugin').Options}
 */
exports.apply = (api, options) => {
  api.hook('createWebpackChain', config => {
    if (!api.isProd || !api.config.output.clean) return;
    const { CleanWebpackPlugin } = require('clean-webpack-plugin');
    options.verbose = Boolean(api.args.options.debug);
    config
      .plugin('clean')
      .use(CleanWebpackPlugin, [options]);
  });
};
