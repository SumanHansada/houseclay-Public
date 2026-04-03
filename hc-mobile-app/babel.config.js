module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@hc-sdk': '../hc-sdk/dist',
        },
        extensions: [
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.js',
          '.android.js',
          '.js',
          '.json',
        ],
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
