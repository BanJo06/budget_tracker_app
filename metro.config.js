// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname); // Use await for async getDefaultConfig

  // Apply NativeWind first or as a wrapper around the base config
  const nativeWindConfig = withNativeWind(config, { input: "./app/globals.css" });

  // Now, apply your SVG transformer modifications to the config
  const { transformer, resolver } = nativeWindConfig; // Get transformer/resolver from the NativeWind-enhanced config

  nativeWindConfig.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  };
  nativeWindConfig.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
  };

  return nativeWindConfig;
})();