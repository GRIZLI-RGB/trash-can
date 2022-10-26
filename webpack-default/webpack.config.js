const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const mode = process.env.NODE_ENV || 'development'; // if start "build-dev", variable is "production", else variable is "development"

module.exports = {
    mode,
    devServer: {
        port: 8000,
        open: true
    },
    entry: './src/js/main.js',
    output: {
        clean: true,
        path: __dirname + '/dist',
        filename: 'js/main.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname + '/src/index.html'
        }),
        new MiniCssExtractPlugin(
            {
                filename: 'style.css',
            }
        )
    ],
    module: {
        rules: [
          {
            test: /\.(c|sa|sc)ss$/i,
            use: [
                (mode == 'development') ? "style-loader" : MiniCssExtractPlugin.loader,
                "css-loader",
                {
                    loader: "postcss-loader",
                    options: {
                      postcssOptions: {
                        plugins: [
                          [
                            "postcss-preset-env",
                            {
                              // Options
                            },
                          ],
                        ],
                      },
                    },
                },
                "sass-loader"
            ]
          },
          {
            test: /\.(png|svg|gif|jpeg|jpe)$/i
          }
        ],
    }
}