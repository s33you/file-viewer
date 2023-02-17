import path from 'path'
import { cwd } from 'process'
export const FORMAT = ['.bmp', '.jpg', '.png', '.tif', '.gif', '.webp', '.jfif', '.jpeg']
export const COVER_PRFIX =  'cover__'
export const BASE_PATH = cwd()
export const __dirname = decodeURIComponent(path.dirname(new URL(import.meta.url).pathname)).replace('/','')

