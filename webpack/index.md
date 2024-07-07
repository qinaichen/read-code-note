---
layout: doc
---
# Webpack 多页面自动导入

## 依赖项
```json
  "devDependencies": {
    "@babel/core": "^7.24.7",
    "@babel/preset-env": "^7.24.7",
    "babel-loader": "^9.1.3",
    "css-loader": "^7.1.2",
    "glob": "^10.4.2",
    "html-webpack-plugin": "^5.6.0",
    "style-loader": "^4.0.0",
    "webpack": "^5.92.1",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "^5.0.4"
  }
```

## webpack.config.js内容

```javascript
const path = require("path");
const Glob = require("glob");
const htmlWebpackPlugin = require("html-webpack-plugin");




function getEntry(globPath){
    const entries = {main: './src/index.js'};
    Glob.sync(`${globPath}.js`).forEach(entry => {
        const basename = path.basename(entry,path.extname(entry));
        const pathname = path.dirname(entry);
        entries[basename] = `${pathname}/${basename}`;
    })
}


function getHtmlWebpackPlugins(globPath){
    const htmlPlugins = [];
    Glob.sync(`${globPath}.html`).forEach(entry => {
        const basename = path.basename(entry,path.extname(entry));
        const pathname = path.dirname(entry);
        htmlPlugins.push(new htmlWebpackPlugin({
            title: basename,
            filename: `${basename}.html`,
            template: `${pathname}/${basename}.html`,
            chunks: [basename,'main'],
            minify: true,
        }))
    })
    return htmlPlugins;
}


function getPages(pagePath){
    const entries = getEntry(pagePath);
    const htmlPlugins = getHtmlWebpackPlugins(pagePath);
    return {
        entries,
        htmlPlugins
    }
}

const {entries,htmlPlugins} =getPages('./public/**/*')

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: entries,
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                type: "asset/resource",
            },
            {
                test: /\.(woff|woff2|eot|tff|otf)$/i,
                type: "asset/resource",
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:{
                    loader: "babel-loader",
                    options: {
                        presets:['@babel/preset-env'],
                    }
                }
            }
        ]
    },
    plugins: [
        ...htmlPlugins
    ],
    devServer: {
        port: 3000,
        hot: true,
    }
}
```

