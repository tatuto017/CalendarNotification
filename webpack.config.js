const path = require('path');
const GasPlugin = require('gas-webpack-plugin');

module.exports = {
	mode: 'development',
	devtool: 'inline-source-map',
	context: __dirname,
	entry: {
		main: path.resolve(__dirname, 'src', 'index.ts')
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'index.js'
	},
	resolve: {
		extensions: ['.ts', '.js'],
		modules: ['node_modules']
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader'
			}
		]
	},
	plugins: [new GasPlugin()]
};