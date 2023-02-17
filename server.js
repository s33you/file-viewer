import Koa from "koa";
import KoaStatic from "koa-static";
import KoaRouter from 'koa-router'
import cors from 'koa-cors'

import { networkInterfaces } from "os";
import path from "path";
import fs from 'fs'