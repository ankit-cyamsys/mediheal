const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = withNativeWind(getDefaultConfig(__dirname), { input: './global.css' });

// zustand's ESM build (`esm/*.mjs`, selected on web via the "import" export
// condition) uses `import.meta.env.MODE`. Browsers can't parse `import.meta`
// when Metro serves the bundle as a classic <script>, so web crashes with
// "Cannot use 'import.meta' outside a module". Force zustand to its CJS build
// on web by resolving it without the "import" condition (native is unaffected —
// it already resolves to CJS via the "react-native" condition).
const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const resolve = defaultResolveRequest ?? context.resolveRequest;
  const resolution = resolve(context, moduleName, platform);
  if (
    platform === 'web' &&
    resolution?.type === 'sourceFile' &&
    /[\\/]zustand[\\/]esm[\\/].*\.mjs$/.test(resolution.filePath)
  ) {
    return {
      ...resolution,
      filePath: resolution.filePath
        .replace(/([\\/])zustand[\\/]esm[\\/]/, '$1zustand$1')
        .replace(/\.mjs$/, '.js'),
    };
  }
  return resolution;
};

module.exports = config;
