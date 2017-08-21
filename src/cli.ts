import * as yargs from 'yargs';
import download from './download';
import convert from './convert';
import play from './play'

const argv = yargs
    .usage('$0 <命令> [选项]')
    .command(['download', 'down', 'd'], '下载专辑音频', (yargs) => {
        const url = yargs.argv._[1];
        if (!url.match(/www.ximalaya.com/)) {
            console.log("输入的 url 出错了, 目前只支持喜马拉雅的音频哦。")
        }
        download(url).then(console.log).then(() => {
            process.exit(0)
        }).catch(console.error)
        return argv;
    })
    .example('xmly download http://www.ximalaya.com/4498275/album/269388/', "下载专辑 ID 为 269388 的所以声音")
    .command(['convert', 'c'], '转换 m4a 文件', (yargs) => {
        convert().then(console.log).then(() => {
            process.exit(0)
        }).catch(console.error)
        return argv;
    })
    .command(['player', 'p'], '播放 mp3 文件', (yargs) => {
        play().then(console.log).catch((err) => {
            console.error(err)
            process.exit(0)
        })
        return argv;
    })
    .help()
    .argv

if (!argv._.length) {
    yargs.showHelp()
    process.exit(0)
}