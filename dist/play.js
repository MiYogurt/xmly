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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var player_1 = require("./player");
var inquirer = require("inquirer");
var glob = require("glob");
var selectFolder_1 = require("./selectFolder");
var getMp3Choies = function (folders) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, folders
                .map(function (folder) { return glob.sync(__dirname + '/../audio/' + folder + '/mp3/*.mp3'); })
                .reduce(function (prev, current) { return prev.concat(current); }, [])
                .map(function (mp3File) {
                var nameReg = /mp3\/([\s\S]*).mp3$/ig;
                return nameReg.exec(mp3File)[1];
            })
            // 抽取音频名称部分
        ];
    });
}); };
function askSelectMp3File(choices) {
    return __awaiter(this, void 0, void 0, function () {
        var questions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    questions = {
                        type: 'checkbox',
                        name: 'paths',
                        message: '添加音频到播放列表',
                        validate: function (value) {
                            if (!value.length)
                                return "必须选择哦。";
                            return true;
                        },
                        choices: choices,
                    };
                    return [4 /*yield*/, inquirer.prompt(questions)];
                case 1: return [2 /*return*/, (_a.sent()).paths
                        .map(function (mp3File) { return glob.sync(__dirname + '/../audio/**/' + mp3File + '.mp3'); })
                        .reduce(function (prev, current) { return prev.concat(current); }, [])];
            }
        });
    });
}
var player;
function playLoop(player) {
    var message = "\n======================\nq: \u9000\u51FA\nr: \u6E05\u7A7A\u64AD\u653E\u5217\u8868\uFF0C\u518D\u8FDB\u884C\u6DFB\u52A0\nre: \u91CD\u542F player\nx: \u505C\u6B62\ns: \u6682\u505C\np: \u64AD\u653E\na: \u589E\u52A0\u64AD\u653E\u66F2\u76EE\nn: \u4E0B\u4E00\u9996\nb: \u4E0A\u4E00\u9996\nl: \u67E5\u770B\u64AD\u653E\u5217\u8868\n======================\n        ";
    console.log(message);
    inquirer.prompt({
        type: 'input',
        name: 'oprator',
        message: "选择你要的操作",
    }).then(function (answer) {
        var oprator = answer.oprator;
        if (oprator === 'q') {
            return process.exit(0);
        }
        var currentName = player.playing._name;
        return Oprator(oprator, currentName);
    }).then(function () { return playLoop(player); }).catch(console.error);
}
function Oprator(opratorName, currentName) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, init_play_list, new_play_list, add_play_list, currentId_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = opratorName;
                    switch (_a) {
                        case "re": return [3 /*break*/, 1];
                        case "r": return [3 /*break*/, 3];
                        case "a": return [3 /*break*/, 5];
                        case "s": return [3 /*break*/, 7];
                        case "p": return [3 /*break*/, 8];
                        case "n": return [3 /*break*/, 9];
                        case "b": return [3 /*break*/, 10];
                        case "x": return [3 /*break*/, 11];
                        case "l": return [3 /*break*/, 12];
                    }
                    return [3 /*break*/, 13];
                case 1:
                    player.stop();
                    player = null;
                    return [4 /*yield*/, selectPlayList()];
                case 2:
                    init_play_list = _b.sent();
                    player = new player_1.default(init_play_list);
                    player.stop();
                    player.play();
                    return [3 /*break*/, 13];
                case 3: return [4 /*yield*/, selectPlayList()];
                case 4:
                    new_play_list = _b.sent();
                    player._list = [];
                    new_play_list.forEach(function (list) { return player.add(list); });
                    player.stop();
                    player.play();
                    return [3 /*break*/, 13];
                case 5: return [4 /*yield*/, selectPlayList()];
                case 6:
                    add_play_list = _b.sent();
                    add_play_list.forEach(function (list) { return player.add(list); });
                    return [3 /*break*/, 13];
                case 7:
                    player.pause();
                    return [3 /*break*/, 13];
                case 8:
                    player.play();
                    return [3 /*break*/, 13];
                case 9:
                    console.log("当前正在播放: " + currentName);
                    player.stop();
                    player.next();
                    return [3 /*break*/, 13];
                case 10:
                    console.log("当前正在播放: " + currentName);
                    player.stop();
                    player.prev();
                    return [3 /*break*/, 13];
                case 11:
                    player.stop();
                    return [3 /*break*/, 13];
                case 12:
                    currentId_1 = player.playing._id;
                    console.log("播放列表如下：");
                    player._list.forEach(function (song) {
                        if (song._id === currentId_1) {
                            console.log(" >>>>>>> " + "[" + song._id + "]" + song._name);
                            return;
                        }
                        console.log("         " + "[" + song._id + "]" + song._name);
                    });
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    });
}
function selectPlayList() {
    return __awaiter(this, void 0, void 0, function () {
        var folders, mp3Choies;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, selectFolder_1.default('选择文件夹【多选】')];
                case 1:
                    folders = _a.sent();
                    return [4 /*yield*/, getMp3Choies(folders)];
                case 2:
                    mp3Choies = _a.sent();
                    return [4 /*yield*/, askSelectMp3File(mp3Choies)];
                case 3: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var play_list, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, selectPlayList()];
                case 1:
                    play_list = _a.sent();
                    player = new player_1.default(play_list);
                    // console.log(player.list);
                    player.play();
                    // player.on('playing', function(item: any) {
                    //     console.log(JSON.stringify(item, null, 2));
                    // });
                    // player.on('playend', function(item: any) {
                    //     console.log('src:' + item + ' play done, switching to next one ...');
                    // });
                    player.on('error', function (err) {
                        console.log(err);
                    });
                    return [2 /*return*/, playLoop(player)];
                case 2:
                    e_1 = _a.sent();
                    console.log(e_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.default = main;
