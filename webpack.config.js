const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
  entry: {
    app: ["./public/assets/js/index.js","./public/assets/js/db.js"]
  },
  output: {
    path: path.resolve(__dirname + "/public/dist"),
    filename: "[name].bundle.js"
  },
  mode: "development",
  // add configuration to use babel-loader here
  plugins: [
    new WebpackPwaManifest({
      publicPath: "./",
      filename: "manifest.webmanifest",
      fingerprints: false,
      inject: false,
      name: "Budget Tracker",
      short_name: "Budget Tracker",
      description: "An application to keep track of your budget",
      background_color: "#01579b",
      theme_color: "#ffffff",
      "theme-color": "#ffffff",
      start_url: "/",
      display: "standalone",
      icons: [{
        src: path.resolve("public/assets/images/icons/icon-512x512.png"),
        sizes: [96, 128, 192, 256, 384, 512],
        destination: path.join("assets", "icons")
      }]
    }),
  ],
  module: {
    rules: [{
      test: /\.m?js$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"]
        }
      }
    }]
  },
};
module.exports = config;