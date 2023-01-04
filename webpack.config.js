const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fs = require('fs');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src/app.ts'),
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 3000,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'handlebars': 'handlebars/dist/handlebars.js'
    }
  },
  externals: { fs },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, 'tsconfig.json'),
            },
          },
        ],
        exclude: /(node_modules)/
      },
      {
        test: /\.scss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },
      {
          test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
          type: 'asset/inline',
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Чаты',
      template: path.resolve(__dirname, './src/pages/index.html'),
      filename: 'index.html',
    }),
  ]
};