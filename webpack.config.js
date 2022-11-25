/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { merge } = require("webpack-merge");

const sharedConfig = {
  mode: "production",
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  externals: {
    kolmafia: "commonjs kolmafia"
  },
  optimization: {
    minimize: false
  }
};

const CopyPlugin = require("copy-webpack-plugin");

// Create the NPM library
const libConfig = merge(
  {
    entry: ["./src/mafia/RelayUtils.ts"],
    output: {
      filename: "index.js",
      path: path.join(__dirname, "./dist"),
      libraryTarget: "commonjs"
    },
    module: {
      rules: [
        {
          // Include ts, tsx, js, and jsx files.
          test: /\.(ts|js)x?$/,
          // exclude: /node_modules/,
          loader: "babel-loader"
        }
      ]
    },
    plugins: [
      new CopyPlugin({
        patterns: [{ from: "./dist/mafia/RelayUtils.d.ts", to: "./index.d.ts" }]
      })
    ]
  },
  sharedConfig
);

// Create the relay file
const otherRelayConfig = merge(
  {
    entry: "./src/mafia/RelayScript.ts",
    output: {
      path: path.join(__dirname, "./built/relay/"),
      filename: "shared_relay.js",
      libraryTarget: "commonjs"
    },
    module: {
      rules: [
        {
          // Include ts, tsx, js, and jsx files.
          test: /\.(ts|js)x?$/,
          // exclude: /node_modules/,
          loader: "babel-loader"
        }
      ]
    }
  },
  sharedConfig
);

// Create the react files
const relayConfig = merge(
  {
    entry: "./src/relay/index.tsx",
    output: {
      path: path.join(__dirname, "./built/relay/shared_relay/"),
      filename: "shared_relay.js",
      libraryTarget: "commonjs"
    },
    module: {
      rules: [
        {
          // Include ts, tsx, js, and jsx files.
          test: /\.(ts|js)x?$/,
          // exclude: /node_modules/,
          loader: "babel-loader",
          options: { presets: ["@babel/env", "@babel/preset-react"] }
        },
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
        }
      ]
    },
    plugins: [new MiniCssExtractPlugin()]
  },
  sharedConfig
);

module.exports = [libConfig, relayConfig, otherRelayConfig];
