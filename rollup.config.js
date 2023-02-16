import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';      
import json from '@rollup/plugin-json';   
export default {
    input: 'main.js',
    output: {
        file: 'dist/server.cjs',
        format: 'cjs',
        
    },
    plugins: [commonjs({
        dynamicRequireTargets: [
            '!node_modules/sharp/build/Release/sharp-win32-x64.node',
        ], 
    }), nodeResolve(), json()]
    // external: ['koa', 'koa-static', 'path', 'commander', 'koa-router', 'fs','koa-cors','os']
};