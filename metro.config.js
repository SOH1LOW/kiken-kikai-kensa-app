const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, {
  input: "./global.css",
  // Disable forceWriteFileSystem for production builds to avoid SHA-1 errors in Vercel/CI
  forceWriteFileSystem: process.env.NODE_ENV !== 'production',
});
