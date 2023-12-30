/* eslint-disable @typescript-eslint/no-var-requires */
console.log("🐲 webpack.config.js");

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const runMode = process.env.RUN_MODE || "development";

module.exports = {
  mode: runMode,
  entry: {
    app: path.resolve("src", "index.ts"),
  },
  output: {
    path: path.resolve("dist"),
    filename: "[name].js",
    clean: true,
  },
  module: {
    rules: moduleRules(),
  },
  resolve: {
    modules: [path.resolve("src"), "node_modules"],
    extensions: [".ts", ".js"],
  },
  plugins: plugins(),
  devServer: {
    host: "localhost",
    port: 3767,
  },
  devtool: "source-map",
};

function moduleRules() {
  return [
    {
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, "css-loader"],
    },
    {
      test: /\.(js|ts)$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
      },
    },
  ];
}

function plugins() {
  return [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve("public", "index.html"),
      templateParameters: { mode: runMode },
      hash: true,
      minify:
        process.env.NODE_ENV === "production"
          ? {
              collapseWhitespace: true,
              removeComments: true,
            }
          : false,
    }),
  ];
}
