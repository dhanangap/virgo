const path = require("path");
const webpack = require("webpack");

module.exports = {

	// Basic input and output configuration

	mode: "production",
	entry: {
		bundle: "./src/bundle.ts",
	},
	output: {
		filename: "virgo.[name].min.js",
		path: path.resolve(__dirname, "dist"),
		library: {
			name: "Virgo",
			type: "umd",
		},
	},

	// Process configuration

	module: {
		rules: [
			// Typescript
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
			// HTML
			{
				test: /\.html$/i,
				use: "html-loader",
			},
		],
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
	},
	devtool: false,
	plugins: [
		new webpack.SourceMapDevToolPlugin({ filename: 'virgo.[name].min.js.map' })
	],

};
