const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js', // Entry point for your app
    output: {
        path: path.resolve(__dirname, 'dist'), // Output directory
        filename: 'bundle.js', // Output file name
        publicPath: '/testing', // Base URL for the app
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, // Transpile JavaScript and JSX files
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.css$/, // Handle CSS files
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpg|gif|svg)$/, // Handle image files
                use: ['file-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'], // Resolve these extensions
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'), // Serve files from this directory
        compress: true,
        port: 3000, // Development server port
        historyApiFallback: true, // Support for client-side routing
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html', // Template for the generated HTML file
        }),
    ],
};
