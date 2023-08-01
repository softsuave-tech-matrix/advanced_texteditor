const path = require("path");

module.exports = {
  mode: "production",
  entry: "./textEditor.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    libraryTarget: "umd",
    library: "Advanced",
    umdNamedDefine: true,
  },
};
