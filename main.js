/*
 * @Author: wenbin.tan
 * @Date: 2022-08-28 17:41:18
 * @LastEditors: wenbin.tan
 * @Description: 
 */
import Koa from "koa";
import { networkInterfaces } from "os";
import KoaStatic from "koa-static";
import path from "path";
import { program } from "commander";
import KoaRouter from 'koa-router'
import fs from 'fs'
import cors from 'koa-cors'
import { cwd } from "process";
import getFiles from "./getFile.js";
import { compressFiles, getCoverName } from "./utils.js";

const basePath = cwd()
const __dirname = decodeURIComponent(path.dirname(new URL(import.meta.url).pathname)).replace('/','')
console.log('----import_meta---',import.meta)
console.log('----dirname---',__dirname)
const commandOptions = {}

program
  .option("-p, --port <port>", "port", "8088")
  .action((params) => {
    commandOptions.port = params.port
  })
  .parse(process.argv);
const app = new Koa();

const router = new KoaRouter()
const { WLAN } = networkInterfaces();
const net = WLAN.find((network) => {
  return network.family === "IPv4";
});

/**
 * 获取该目录下所有属于图片和视频的文件信息
 */
const files = getFiles(basePath, {
  exclude: ['node_modules']
}).map((file)=>{
  if(typeof file ==='string'){
    return file.toLowerCase()
  }
})

const filter = (file)=>{
  return ['.bmp', '.jpg', '.png', '.tif', '.gif', '.webp', '.jfif', '.jpeg'].includes(path.extname(file))
}

const imgs = files.filter(filter)
compressFiles(imgs)
const fileList = files.map(file => {
  if (filter(file)) {
    return {
      name: path.relative(basePath,file),
      url: `http://${net.address}:${commandOptions.port}/${path.relative(basePath, file) }`,
      // cover: `http://${net.address}:${commandOptions.port}/${path.relative(basePath, getCoverName(file))}`,
      
    };
  }
}).filter(file => file)



fs.writeFileSync('./files.json', JSON.stringify(fileList,null,4))
if (net) {
  router.get("/fileList", (ctx, next) => {
    const { size, current } = ctx.query
    ctx.body = fileList.slice((current - 1) * size, current * size)
  });
  
  app.use(cors())
  app.use(KoaStatic(basePath));

  const viewer_path = path.resolve(__dirname,'viewer')  
  app.use(KoaStatic(viewer_path,{
    gzip:true,
  }));
  app.use(router.routes());
  const createServer = () => {
    try {
      app.listen(commandOptions.port, net.address).on('error', err => {
        console.log('create Server fail restart...')
        ++commandOptions.port
        createServer()
      }).on('listening', () => { 
        console.log('cmd dir is ' + basePath)
        console.log('current viewer path is ' + viewer_path )
        console.log(`server is running at ${net.address} on port ${commandOptions.port}`);
      })
    }
    catch (e) {

    }
  }
  createServer()
}
