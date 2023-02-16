/*
 * @Author: wenbin.tan
 * @Date: 2022-08-28 20:42:46
 * @LastEditors: wenbin.tan
 * @Description: 
 */
import path from "path";
import fs from 'fs'
const getFiles = (input,options={},paths=[]) => {
    const {exclude = [] } = options
    const isDir = fs.lstatSync(input).isDirectory()
    if (isDir) {
        const files = fs.readdirSync(input)
        files.map(file=>{
            if (!options.exclude.includes(file)) {
                getFiles(path.resolve(input, file), options, paths)
            }
        })
    }
    else{
        paths.push(input)
    }
    return paths
}

export default getFiles
