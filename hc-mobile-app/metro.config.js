const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const sdkPath = path.resolve(__dirname, '../hc-sdk');

const config = {
  watchFolders: [sdkPath],
  resolver: {
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(sdkPath, 'node_modules'),
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
