import * as fs from 'fs-extra';
import * as ffmpeg from 'fluent-ffmpeg';
import * as inquirer from 'inquirer';
import * as glob from 'glob';
import selectFolder from './selectFolder';

var ui = new inquirer.ui.BottomBar();

export default async function() {

    const folders = await selectFolder('选择你要转换的文件夹');

    for(let folder of folders){
        let baseURL = __dirname + '/../audio/' + folder;
        const m4aFiles = glob.sync(baseURL + '/m4a/*.m4a');
        fs.ensureDirSync(baseURL + '/mp3')
        const mp3Files = glob.sync(baseURL + '/mp3/*.mp3');
        if(m4aFiles.length === mp3Files.length){
            console.log(baseURL, " 已经转换过了~")
            continue;
        }

        for(let m4a of m4aFiles){
            const nameReg = /m4a\/([\s\S]*).m4a$/ig
            const filename = nameReg.exec(m4a)[1]
            const output = m4a.replace(/m4a/g, 'mp3');
            try{
                const msg = await convert(m4a, output, filename)
                console.log('\n');
                console.log(msg)
            }catch(e){
                console.log(e);
            }
        }
    }

    return "转换完成";
}

function convert(input: string, output: string, filename: string){
    return new Promise((resolve, reject) => {
        ffmpeg(input)
            .withNoVideo()
            .inputFormat('m4a')
            .audioCodec('libmp3lame')
            .audioBitrate(128)
            .format('mp3')
            .on('error', (err) => reject(err))
            .on('progress', function(progress) {
                ui.updateBottomBar('⏳  ' + filename + ' -> ' + progress.percent.toFixed(2) + '%');
            })
            .on('end', () => resolve(filename + " 转换成功"))
            .saveToFile(output)
    })
}


