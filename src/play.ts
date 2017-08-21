import Player from './player';
import * as inquirer from 'inquirer';
import * as glob from 'glob';
import * as fs from 'fs-extra';
import selectFolder from './selectFolder'
import * as keypress from 'keypress';

const getMp3Choies = async (folders: string[]) => {
    return folders
        .map(folder => glob.sync(__dirname + '/../audio/' + folder + '/mp3/*.mp3'))
         // 获取所有的 MP3 文件
        .reduce((prev, current) =>  prev.concat(current), [])
        // 圧平数组
        .map(mp3File => {
            const nameReg = /mp3\/([\s\S]*).mp3$/ig
            return nameReg.exec(mp3File)[1]
        })
        // 抽取音频名称部分
}

async function askSelectMp3File(choices) {
    const questions: inquirer.Questions = {
        type: 'checkbox',
        name: 'paths',
        message: '添加音频到播放列表',
        validate: (value) => {
            if (!value.length) return "必须选择哦。"
            return true;
        },
        choices,
    }
    return <string[]>(await inquirer.prompt(questions)).paths
        .map(mp3File => glob.sync(__dirname + '/../audio/**/' + mp3File + '.mp3'))
        .reduce((prev, current) => prev.concat(current), [])
}

let player;

function playLoop(player: Player){
        const message = `
======================
q: 退出
r: 清空播放列表，再进行添加
re: 重启 player
x: 停止
s: 暂停
p: 播放
a: 增加播放曲目
n: 下一首
b: 上一首
l: 查看播放列表
======================
        `;
        console.log(message);

        inquirer.prompt({
            type: 'input',
            name: 'oprator',
            message: "选择你要的操作",
        }).then(answer => {
            const oprator = answer.oprator;
            if (oprator === 'q') {
                return process.exit(0)
            }
            const currentName = player.playing._name
            return Oprator(oprator, currentName);
        }).then(() => playLoop(player)).catch(console.error)

}

async function Oprator(opratorName: string, currentName: string) {
    switch (opratorName) {
        case "re":
            player.stop()
            player = null;
            const init_play_list = await selectPlayList()
            player = new Player(init_play_list);
            player.stop()
            player.play()
            break;
        case "r":
            const new_play_list = await selectPlayList()
            player._list = [];
            new_play_list.forEach(list => player.add(list))
            player.stop()
            player.play()
            break;
        case "a":
            const add_play_list = await selectPlayList()
            add_play_list.forEach(list => player.add(list))
            break;
        case "s":
            player.pause()
            break;
        case "p":
            player.play();
            break;
        case "n":
            console.log("当前正在播放: " + currentName);
            player.stop();
            player.next();
            break;
        case "b":
            console.log("当前正在播放: " + currentName);
            player.stop();
            player.prev();
            break;
        case "x":
            player.stop();
            break;
        case "l":
            const currentId = player.playing._id
            console.log("播放列表如下：");
            player._list.forEach(song => {
                if (song._id === currentId) {
                    console.log(" >>>>>>> " + "[" + song._id + "]" + song._name);
                    return;
                }
                console.log("         " + "[" + song._id + "]" + song._name);
            })
            break;
    }
}


async function selectPlayList(){
    const folders = await selectFolder('选择文件夹【多选】');
    const mp3Choies = await getMp3Choies(folders);
    return await askSelectMp3File(mp3Choies);
}

export default async function main(){
    try{

        const play_list = await selectPlayList();
        player = new Player(play_list);
        // console.log(player.list);
        player.play()

        // player.on('playing', function(item: any) {
        //     console.log(JSON.stringify(item, null, 2));
        // });

        // player.on('playend', function(item: any) {
        //     console.log('src:' + item + ' play done, switching to next one ...');
        // });

        player.on('error', function(err: any) {
            console.log(err);
        });

        return playLoop(player)

    }catch(e){
        console.log(e)
    }
}

