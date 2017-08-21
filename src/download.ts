import * as R from 'request';
import * as cheerio from 'cheerio';
import { createWriteStream } from 'fs';
import * as fs from 'fs-extra'

function countPage(url): Promise<{ pages: string[], title: string}>{
    return new Promise((resolve, reject) => {
        const html = R.get(url, (err, res, body) => {
            const $ = cheerio.load(body);
            const linkBtnsDom = $('.pagingBar_page');
            const lastPageBtn = linkBtnsDom[linkBtnsDom.length - 2];
            url = url.replace(/\/$/, '') // 去除末尾的 /
            // console.log(linkBtnsDom.val());
            const length = parseInt(linkBtnsDom.val()) || 1
            const pages = Array.from({ length }, (v, k) => (url + "?order=desc&page=" + (1 + k)));
            const title = $('.detailContent_title h1')['0'].children[0].data || url;
            resolve({ pages, title})
        })
    });
}


function getIDByURL(url: string): Promise<string[]>{
    return new Promise((resolve, rej) => {
        R(url, (err, res, body) => {
            const $ = cheerio.load(body);
            let liDom = $('.album_soundlist li');
            const partIds = getIdsFromDom(liDom);
            resolve(partIds);
        })
    })
}


async function getIds(page: string[]){
    const taskQ = page.map((v, k) => {
        return getIDByURL(v);
    });

    return await Promise.all(taskQ); // 页面不多直接一起并发爬
}


function getIdsFromDom(dom: Cheerio){
    return Array.from(dom).map((v, k) => {
        return v.attribs['sound_id'];
    })
}

async function download(id, album_title) {
    let yes;

    const uri = `http://www.ximalaya.com/tracks/${id}.json`;
     R.get(uri, function(err, res, body){
        const obj = JSON.parse(body);
        const medieURL: string = obj.play_path;
        const title : string = obj.title;
        console.log("正在下载 《" + album_title + ' --- ' + title + "》");
        saveM4AFile(medieURL, album_title, title, yes);
    });
    return new Promise((resolve, reject) => yes = resolve);
}


function saveM4AFile(URL, album_title, title, yes) {
        fs.mkdirsSync('./audio/' + album_title + '/m4a')

        R.get(URL, {
            headers: {
                "Content-Type": "application/octet-stream"
            }
        }).pipe(createWriteStream('./audio/' + album_title + '/m4a/' +  title + '.m4a').on('error', console.error)).on('error', console.error).on('close', () => yes(title + " 下载完成！"));
}

export default async function(url: string) {
    const { pages, title } = await countPage(url)
    let idsArray = await getIds(pages);
    const ids = idsArray.reduce((prev, current) => prev.concat(current), [])

    for(let id of ids){
        const msg = await download(id, title);
        console.log(msg);
    }
    return "下载完成";
}
