import * as fs from 'fs-extra';
let choices: any[] = [];
if(fs.existsSync(__dirname + '/../audio')){
    choices = fs.readdirSync(__dirname + '/../audio')
}

const ignoreFile = ['.DS_Store', '.git']

choices = choices.filter((val) => {
    return ignoreFile.indexOf(val) < 0;
})

export default choices;