const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    content: "./content-script.js"
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  devtool: "cheap-module-source-map" // 👈 avoids eval
};