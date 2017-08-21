import choices from './choices';
import * as inquirer from 'inquirer';

export default async function (message: string) {
    const questions: inquirer.Questions = {
        type: 'checkbox',
        name: 'paths',
        message,
        validate: (value) => {
            if (!value.length) return "必须选择哦。"
            return true;
        },
        choices,
    }
    const folders = <string[]>(await inquirer.prompt(questions)).paths;
    return folders;
}

