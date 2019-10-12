'use strict';

const { execFileSync } = require('child_process');

const execSync = (cmd, args, opts) => execFileSync(cmd, args, opts).toString().trim();
const isObject = arg => arg !== null && typeof arg === 'object';

exports.name = 'html-version-spec';

/**
 * @param api {import('poi')}
 */
exports.apply = ({ config, pkg }) => {
  const { output, pages } = config;
  const meta = {
    get version() {
      return getVersion(pkg);
    }
  };
  if (isObject(pages)) {
    return Object.values(pages).forEach(page => Object.assign(page, { meta }));
  }
  output.html = output.html || {};
  Object.assign(output.html, { meta });
};

function getVersion(pkg) {
  const { codename, version } = pkg.data;
  try {
    const rev = execSync('git', ['rev-parse', '--short', 'HEAD']);
    return [
      `${version}-rev-${rev}`,
      codename && `(${codename})`
    ].filter(Boolean).join(' ');
  } catch (err) {
    console.error(err);
  }
  return [
    `${version}`,
    codename && `(${codename})`
  ].filter(Boolean).join(' ');
}
