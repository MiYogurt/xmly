"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var ffmpeg = require("fluent-ffmpeg");
var inquirer = require("inquirer");
var glob = require("glob");
var selectFolder_1 = require("./selectFolder");
var ui = new inquirer.ui.BottomBar();
function default_1() {
    return __awaiter(this, void 0, void 0, function () {
        var folders, _i, folders_1, folder, baseURL, m4aFiles, mp3Files, _a, m4aFiles_1, m4a, nameReg, filename, output, msg, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, selectFolder_1.default('选择你要转换的文件夹')];
                case 1:
                    folders = _b.sent();
                    _i = 0, folders_1 = folders;
                    _b.label = 2;
                case 2:
                    if (!(_i < folders_1.length)) return [3 /*break*/, 9];
                    folder = folders_1[_i];
                    baseURL = __dirname + '/../audio/' + folder;
                    m4aFiles = glob.sync(baseURL + '/m4a/*.m4a');
                    fs.ensureDirSync(baseURL + '/mp3');
                    mp3Files = glob.sync(baseURL + '/mp3/*.mp3');
                    if (m4aFiles.length === mp3Files.length) {
                        console.log(baseURL, " 已经转换过了~");
                        return [3 /*break*/, 8];
                    }
                    _a = 0, m4aFiles_1 = m4aFiles;
                    _b.label = 3;
                case 3:
                    if (!(_a < m4aFiles_1.length)) return [3 /*break*/, 8];
                    m4a = m4aFiles_1[_a];
                    nameReg = /m4a\/([\s\S]*).m4a$/ig;
                    filename = nameReg.exec(m4a)[1];
                    output = m4a.replace(/m4a/g, 'mp3');
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, convert(m4a, output, filename)];
                case 5:
                    msg = _b.sent();
                    console.log('\n');
                    console.log(msg);
                    return [3 /*break*/, 7];
                case 6:
                    e_1 = _b.sent();
                    console.log(e_1);
                    return [3 /*break*/, 7];
                case 7:
                    _a++;
                    return [3 /*break*/, 3];
                case 8:
                    _i++;
                    return [3 /*break*/, 2];
                case 9: return [2 /*return*/, "转换完成"];
            }
        });
    });
}
exports.default = default_1;
function convert(input, output, filename) {
    return new Promise(function (resolve, reject) {
        ffmpeg(input)
            .withNoVideo()
            .inputFormat('m4a')
            .audioCodec('libmp3lame')
            .audioBitrate(128)
            .format('mp3')
            .on('error', function (err) { return reject(err); })
            .on('progress', function (progress) {
            ui.updateBottomBar('⏳  ' + filename + ' -> ' + progress.percent.toFixed(2) + '%');
        })
            .on('end', function () { return resolve(filename + " 转换成功"); })
            .saveToFile(output);
    });
}
