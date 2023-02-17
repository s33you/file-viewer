import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';      
import json from '@rollup/plugin-json';   
export default {
    input: 'main.js',
    output: {
        file: 'server.cjs',
        format: 'cjs',
        banner:'#! /usr/bin/env node\n',
    },
    external:['sharp'],
    
    plugins: [commonjs(), nodeResolve(), json()]
    // external: ['koa', 'koa-static', 'path', 'commander', 'koa-router', 'fs','koa-cors','os']
};