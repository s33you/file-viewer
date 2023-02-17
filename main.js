/*
 * @Author: wenbin.tan
 * @Date: 2022-08-28 17:41:18
 * @LastEditors: wenbin.tan
 * @Description: 
 */
import Koa from "koa";
import KoaStatic from "koa-static";
import KoaRouter from 'koa-router'
import cors from 'koa-cors'


import { networkInterfaces } from "os";
import path from "path";
import fs from 'fs'

import { compressFiles, getCoverName, getFiles} from "./utils.js";

import {__dirname,FORMAT,COVER_PRFIX,BASE_PATH} from './constants.js'

import { registerCommmand } from "./command.js";


const commandOptions = registerCommmand()

const app = new Koa();
const router = new KoaRouter()

const { WLAN } = networkInterfaces();
const net = WLAN.find((network) => {
  return network.family === "IPv4";
});

/**
 * 获取该目录下所有属于图片和视频的文件信息
 */
const files = getFiles(BASE_PATH, {
  exclude: ['node_modules']
}).map((file) => {
  if (typeof file === 'string') {
    return file.toLowerCase()
  }
})

const filter = (file) => {
  return file && FORMAT.includes(path.extname(file)) && !file.includes('cover')
}
const imgs = files.filter(filter)
compressFiles(imgs)
const fileList = files.filter(filter).map(file => {
  return {
    name: path.relative(BASE_PATH, file),
    url: `http://${net.address}:${commandOptions.port}/${path.relative(BASE_PATH, file)}`,
    cover: `http://${net.address}:${commandOptions.port}/${path.relative(BASE_PATH, getCoverName(file))}`,
  };
})



fs.writeFileSync('./files.json', JSON.stringify(fileList, null, 4))




if (net) {
  router.get("/fileList", (ctx, next) => {
    const { size, current } = ctx.query
    ctx.body = fileList.slice((current - 1) * size, current * size)
  });

  app.use(cors())
  app.use(KoaStatic(BASE_PATH));

  const viewer_path = path.resolve(__dirname, 'viewer')
  app.use(KoaStatic(viewer_path));
  app.use(router.routes());

  const createServer = () => {
  try {
    app.listen(commandOptions.port, net.address).on('error', err => {
      console.log('Create Server fail restart...')
      ++commandOptions.port
      createServer()
    }).on('listening', () => {
      console.log('Current Dir is ' + BASE_PATH)
      console.log('Current Viewer Path is ' + viewer_path)
      console.log(`Server is running at http://${net.address}:${commandOptions.port}`);
    })
  }
  catch (e) {
    console.log(e)
  }
}
  createServer()
}
