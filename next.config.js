const path = require("path");
// 编译snowbox中的react-native  ->  react-native-web
const withTM = require("next-transpile-modules")(["snowbox-ui"]);

module.exports = withTM({
  outDir: "dist",
  pageExtensions: ["web.jsx", "web.js", "web.tsx", "web.ts"],
  experimental: {
    externalDir: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Transform all direct `react-native` imports to `react-native-web`
      "react-native$": "react-native-web",
      snowbox$: "snowbox-ui",
      // 解决npm link本地代码后 react库存在多份实例的问题
      react: path.join(__dirname, "./node_modules/react"),
    };
    // config.resolve.alias["react-native-linear-gradient"] =
    //   "react-native-web-linear-gradient";
    config.module.rules.push({
      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      use: [
        {
          loader: "url-loader",
          options: {
            esModule: false,
            limit: 1000,
            name: "static/images/[hash].[ext]",
          },
        },
      ],
    });
    return config;
  },
});
