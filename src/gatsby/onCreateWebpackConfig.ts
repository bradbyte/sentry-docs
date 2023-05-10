/* eslint-env node */
/* eslint import/no-nodejs-modules:0 */

import path from 'path';

import {sentryWebpackPlugin} from '@sentry/webpack-plugin';

const getPlugins = reporter => {
  const authToken = process.env.SENTRY_AUTH_TOKEN;
  if (!authToken) {
    reporter.warn('SENTRY_AUTH_TOKEN is not set - will not upload source maps');
    return [];
  }
  return [
    sentryWebpackPlugin({
      org: process.env.SENTRY_PROJECT,
      project: process.env.SENTRY_ORG,
      authToken,
      sourcemaps: {assets: './public/**'},
      disable: process.env.NODE_ENV !== 'production',
    }),
  ];
};

function main({actions, reporter}) {
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
      },
      alias: {
        '~src': path.join(path.resolve(__dirname, '..')),
      },
    },
    plugins: getPlugins(reporter),
  });
}

export default main;
