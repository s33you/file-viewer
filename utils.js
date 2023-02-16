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





