import filePathFilter from "@jsdevtools/file-path-filter";
import fs from 'fs-extra'
import path from 'path';
import sharp from 'sharp'

export const getCoverName = (file) => {
    const info = path.parse(file)
    return `${info.dir}${path.sep}${info.name}_cover${info.ext}`
}
   

export const compressFiles = async (files)=>{
    for(let file of files){
        const cover = getCoverName(file)
        if(fs.existsSync(cover) || file.includes('cover')){
            continue;
        }
        sharp(file).resize(100).toFile(cover)
    }
}



export const getFiles = (input,options={},paths=[]) => {
    const {exclude = [] } = options //dir or name 
    const isDir = fs.lstatSync(input).isDirectory()
    if (isDir) {
        const files = fs.readdirSync(input).filter(filePathFilter({exclude}))
        
        files.map(file=>{
            getFiles(path.resolve(input, file), options, paths)
        })
    }
    else{
        paths.push(input)
    }
    return paths
}


