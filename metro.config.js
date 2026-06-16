const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
const firebaseAuthRn = path.resolve(__dirname, 'node_modules/@firebase/auth/dist/rn/index.js');
const defaultResolveRequest = config.resolver.resolveRequest;

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
};

config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...config.resolver.sourceExts, 'svg'],
  resolveRequest: (context, moduleName, platform) => {
    // Use the React Native Firebase Auth bundle so getReactNativePersistence + AsyncStorage work.
    if (moduleName === 'firebase/auth' && platform !== 'web') {
      return context.resolveRequest(context, firebaseAuthRn, platform);
    }

    if (defaultResolveRequest) {
      return defaultResolveRequest(context, moduleName, platform);
    }

    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = config;
