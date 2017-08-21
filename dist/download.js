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
var R = require("request");
var cheerio = require("cheerio");
var fs_1 = require("fs");
var fs = require("fs-extra");
function countPage(url) {
    return new Promise(function (resolve, reject) {
        var html = R.get(url, function (err, res, body) {
            var $ = cheerio.load(body);
            var linkBtnsDom = $('.pagingBar_page');
            var lastPageBtn = linkBtnsDom[linkBtnsDom.length - 2];
            url = url.replace(/\/$/, ''); // 去除末尾的 /
            // console.log(linkBtnsDom.val());
            var length = parseInt(linkBtnsDom.val()) || 1;
            var pages = Array.from({ length: length }, function (v, k) { return (url + "?order=desc&page=" + (1 + k)); });
            var title = $('.detailContent_title h1')['0'].children[0].data || url;
            resolve({ pages: pages, title: title });
        });
    });
}
function getIDByURL(url) {
    return new Promise(function (resolve, rej) {
        R(url, function (err, res, body) {
            var $ = cheerio.load(body);
            var liDom = $('.album_soundlist li');
            var partIds = getIdsFromDom(liDom);
            resolve(partIds);
        });
    });
}
function getIds(page) {
    return __awaiter(this, void 0, void 0, function () {
        var taskQ;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    taskQ = page.map(function (v, k) {
                        return getIDByURL(v);
                    });
                    return [4 /*yield*/, Promise.all(taskQ)];
                case 1: return [2 /*return*/, _a.sent()]; // 页面不多直接一起并发爬
            }
        });
    });
}
function getIdsFromDom(dom) {
    return Array.from(dom).map(function (v, k) {
        return v.attribs['sound_id'];
    });
}
function download(id, album_title) {
    return __awaiter(this, void 0, void 0, function () {
        var yes, uri;
        return __generator(this, function (_a) {
            uri = "http://www.ximalaya.com/tracks/" + id + ".json";
            R.get(uri, function (err, res, body) {
                var obj = JSON.parse(body);
                var medieURL = obj.play_path;
                var title = obj.title;
                console.log("正在下载 《" + album_title + ' --- ' + title + "》");
                saveM4AFile(medieURL, album_title, title, yes);
            });
            return [2 /*return*/, new Promise(function (resolve, reject) { return yes = resolve; })];
        });
    });
}
function saveM4AFile(URL, album_title, title, yes) {
    fs.mkdirsSync('./audio/' + album_title + '/m4a');
    R.get(URL, {
        headers: {
            "Content-Type": "application/octet-stream"
        }
    }).pipe(fs_1.createWriteStream('./audio/' + album_title + '/m4a/' + title + '.m4a').on('error', console.error)).on('error', console.error).on('close', function () { return yes(title + " 下载完成！"); });
}
function default_1(url) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, pages, title, idsArray, ids, _i, ids_1, id, msg;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, countPage(url)];
                case 1:
                    _a = _b.sent(), pages = _a.pages, title = _a.title;
                    return [4 /*yield*/, getIds(pages)];
                case 2:
                    idsArray = _b.sent();
                    ids = idsArray.reduce(function (prev, current) { return prev.concat(current); }, []);
                    _i = 0, ids_1 = ids;
                    _b.label = 3;
                case 3:
                    if (!(_i < ids_1.length)) return [3 /*break*/, 6];
                    id = ids_1[_i];
                    return [4 /*yield*/, download(id, title)];
                case 4:
                    msg = _b.sent();
                    console.log(msg);
                    _b.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [2 /*return*/, "下载完成"];
            }
        });
    });
}
exports.default = default_1;
