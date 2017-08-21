"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var yargs = require("yargs");
var download_1 = require("./download");
var convert_1 = require("./convert");
// var play_1 = require("./play");
var argv = yargs
    .usage('$0 <命令> [选项]')
    .command(['download', 'down', 'd'], '下载专辑音频', function (yargs) {
    var url = yargs.argv._[1];
    if (!url.match(/www.ximalaya.com/)) {
        console.log("输入的 url 出错了, 目前只支持喜马拉雅的音频哦。");
    }
    download_1.default(url).then(console.log).then(function () {
        process.exit(0);
    }).catch(console.error);
    return argv;
})
    .example('xmly download http://www.ximalaya.com/4498275/album/269388/', "下载专辑 ID 为 269388 的所以声音")
    .command(['convert', 'c'], '转换 m4a 文件', function (yargs) {
    convert_1.default().then(console.log).then(function () {
        process.exit(0);
    }).catch(console.error);
    return argv;
})
//     .command(['player', 'p'], '播放 mp3 文件', function (yargs) {
//     play_1.default().then(console.log).catch(function (err) {
//         console.error(err);
//         process.exit(0);
//     });
//     return argv;
// })
    .help()
    .argv;
if (!argv._.length) {
    yargs.showHelp();
    process.exit(0);
}
