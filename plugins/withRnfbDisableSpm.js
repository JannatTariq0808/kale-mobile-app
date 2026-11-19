/**
 * react-native-firebase 26 resolves Firebase through Swift Package Manager by
 * default, which it refuses to combine with the static frameworks this app uses
 * (expo-build-properties useFrameworks: 'static'). pod install then fails with
 * "SPM + static linkage is not supported". Opting out of SPM makes it use
 * CocoaPods for Firebase, as its own error message recommends.
 */
const { withPodfile } = require('expo/config-plugins');

const LINE = '$RNFirebaseDisableSPM = true';

module.exports = function withRnfbDisableSpm(config) {
  return withPodfile(config, (cfg) => {
    if (!cfg.modResults.contents.includes(LINE)) {
      cfg.modResults.contents = `${LINE}\n${cfg.modResults.contents}`;
    }
    return cfg;
  });
};
