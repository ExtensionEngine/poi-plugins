'use strict';

exports.name = 'output-filenames';

const prefix = `${exports.name}-plugin:`;

/**
 * @typedef OutputFilenames {Object}
 * @property standard {import('poi').Config.Output.FileNames}
 * @property vendor {import('poi').Config.Output.FileNames}
 */

/**
 * @param api {import('poi')}
 * @param outputFilenames {OutputFilenames}
 */
exports.apply = (api, { standard, vendor }) => {
  const defaultFilenames = api.config.output.fileNames;
  standard = Object.assign({}, defaultFilenames, standard);
  vendor = Object.assign({}, defaultFilenames, vendor);

  api.logger.debug(prefix, 'standard output filenames', standard);
  api.logger.debug(prefix, 'vendor output filenames', vendor);

  api.hook('createWebpackChain', config => {
    setOutputFilename(config.module.rule('font'), {
      normal: standard.font,
      vendor: vendor.font
    });
    setOutputFilename(config.module.rule('svg'), {
      normal: standard.image,
      vendor: vendor.image
    });
  });
};

/**
* @param rule {import('webpack-chain').Rule}
* @param outputFilenames {OutputFilenames}
*/
function setOutputFilename(rule, { standard, vendor }) {
  const ruleUse = rule.use('file-loader');
  const loader = ruleUse.get('loader');
  const options = ruleUse.get('options');

  rule.uses.store.clear();

  rule.oneOf('vendor')
    .include
      .add(filepath => /node_modules/.test(filepath))
      .end()
    .use(ruleUse.name)
    .loader(loader)
    .options({ ...options, name: vendor || options.name });

  rule.oneOf('standard')
    .use(ruleUse.name)
    .loader(loader)
    .options({ ...options, name: standard || options.name });
}
