module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@actions/*": "./src/actions/*",
            "@components/*": "./src/components/*",
            "@providers/*": "./src/providers/*",
            "@screens/*": "./src/screens/*",
            "@utils/*": "./src/utils/*"
          }
        }
      ]
    ]
  };
};
