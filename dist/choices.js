"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var choices = [];
if (fs.existsSync(__dirname + '/../audio')) {
    choices = fs.readdirSync(__dirname + '/../audio');
}
var ignoreFile = ['.DS_Store', '.git'];
choices = choices.filter(function (val) {
    return ignoreFile.indexOf(val) < 0;
});
exports.default = choices;
