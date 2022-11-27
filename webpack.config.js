/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { merge } = require("webpack-merge");

const sharedConfig = {
  mode: "production",
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  externals: {
    kolmafia: "commonjs kolmafia",
  },
  optimization: {
    minimize: false,
  },
};

// Create the react files
const createReact = merge(
  {
    name: "react",
    entry: "./src/relay/index.tsx",
    output: {
      path: path.join(__dirname, "./built/react"),
      filename: "script.js",
      libraryTarget: "umd",
    },
    module: {
      rules: [
        {
          // Include ts, tsx, js, and jsx files.
          test: /\.tsx$/,
          // exclude: /node_modules/,
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/env",
              "@babel/preset-typescript",
              "@babel/preset-react",
            ],
          },
        },
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        },
      ],
    },
    plugins: [new MiniCssExtractPlugin()],
  },
  sharedConfig
);

const TypescriptDeclarationPlugin = require("typescript-declaration-webpack-plugin");
const RemovePlugin = require("remove-files-webpack-plugin");

// Create the NPM library
const createDeclarations = merge(
  {
    name: "ts",
    entry: "./src/mafia/RelayUtils.ts",
    dependencies: ["react"],
    output: {
      filename: "ignored.js",
      path: path.join(__dirname, "./dist"),
      libraryTarget: "commonjs",
    },
    module: {
      rules: [
        {
          // Include ts, tsx, js, and jsx files.
          test: /\.ts$/,
          // exclude: /node_modules/,
          loader: "ts-loader",
        },
        {
          test: /\.js/,
          type: "asset/inline",
        },
        {
          test: /\.css/,
          type: "asset/source",
        },
      ],
    },
    plugins: [
      new TypescriptDeclarationPlugin({ removeComments: false }),
      new RemovePlugin({
        after: {
          include: ["./dist/ignored.js"],
        },
      }),
    ],
  },
  sharedConfig
);

// Create the NPM library
const createLibrary = merge(
  {
    name: "library",
    entry: "./src/mafia/RelayUtils.ts",
    dependencies: ["react", "ts"],
    output: {
      filename: "index.js",
      path: path.join(__dirname, "./dist"),
      libraryTarget: "commonjs",
    },
    module: {
      rules: [
        {
          // Include ts, tsx, js, and jsx files.
          test: /\.ts$/,
          // exclude: /node_modules/,
          loader: "babel-loader",
        },
        {
          test: /\.js/,
          type: "asset/inline",
        },
        {
          test: /\.css/,
          type: "asset/source",
        },
      ],
    },
  },
  sharedConfig
);

// Create the relay file for non-script installs
const createStandaloneRelay = merge(
  {
    entry: "./src/mafia/RelayScript.ts",
    dependencies: ["library"],
    output: {
      path: path.join(__dirname, "./built/relay/"),
      filename: "shared_relay.js",
      libraryTarget: "commonjs",
    },
    module: {
      rules: [
        {
          // Include ts, tsx, js, and jsx files.
          test: /\.(ts|js)x?$/,
          // exclude: /node_modules/,
          loader: "babel-loader",
        },
        {
          test: /\.js/,
          type: "asset/inline",
        },
        {
          test: /\.css/,
          type: "asset/source",
        },
      ],
    },
    plugins: [
      new RemovePlugin({
        after: {
          include: ["./built/react"],
        },
      }),
    ],
  },
  sharedConfig
);

//module.exports = [relayConfig, libConfig, otherRelayConfig];

module.exports = [
  createReact,
  createDeclarations,
  createLibrary,
  createStandaloneRelay,
];
