const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    popup: path.resolve(__dirname, '..', 'src', 'popup', 'index.tsx'),
    'service-worker': path.resolve(__dirname, '..', 'src', 'background', 'service-worker.ts'),
  },
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: '[name].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', 'public', 'popup.html'),
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '..', 'public', 'manifest.json'),
          to: path.resolve(__dirname, '..', 'dist'),
        },
        {
          from: path.resolve(__dirname, '..', 'public', 'icons'),
          to: path.resolve(__dirname, '..', 'dist', 'icons'),
        },
      ],
    }),
  ],
};
