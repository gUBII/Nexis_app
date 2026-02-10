/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {resolve} = require('metro-resolver');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName === 'axios') {
        return resolve(context, 'axios/dist/browser/axios.cjs', platform);
      }

      return resolve(context, moduleName, platform);
    },
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(defaultConfig, config);
