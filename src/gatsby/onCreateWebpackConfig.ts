/* eslint-env node */
/* eslint import/no-nodejs-modules:0 */

import path from 'path';

import {sentryWebpackPlugin} from '@sentry/webpack-plugin';

function main({actions}) {
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
    plugins: [
      sentryWebpackPlugin({
        org: process.env.SENTRY_PROJECT,
        project: process.env.SENTRY_ORG,
        authToken: process.env.SENTRY_WEBPACK_PLUGIN_AUTH_TOKEN,
        sourcemaps: {assets: './public/**'},
        disable: process.env.NODE_ENV !== 'production',
      }),
    ],
  });
}

export default main;
