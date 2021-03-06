"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const loader_1 = require("./loader");
// import logger from './logger';
const controller_1 = require("./base/controller");
const service_1 = require("./base/service");
const req = require("request");
const blueprint_1 = require("./blueprint");
class Burn extends Koa {
    constructor() {
        super();
        this.config = {};
        this.loader = new loader_1.Loader(this);
        this.port = 3000;
        this.ip = '127.0.0.1';
    }
    loadDefaultMiddleware() {
        const bodyParser = require('koa-bodyparser');
        this.use(bodyParser());
    }
    error() {
        this.use(async (ctx, next) => {
            try {
                await next();
                if (ctx.status === 404) {
                    ctx.body = `<h1>404 not found</h1>`;
                    ctx.set('Content-Type', 'text/html');
                }
            }
            catch (e) {
                let status = e.status || 500;
                let message = e.message || '服务器错误';
                var err = `
                <h3>${status}</h3>
                <h3>${message}</h3>
                `;
                e.stack.split('\n').forEach((stk, index) => {
                    if (index !== 0)
                        err = err + `<p>${stk}</p>`;
                });
                ctx.body = err;
                ctx.set('Content-Type', 'text/html');
            }
        });
    }
    runInDev(handler) {
        if (process.env.NODE_ENV !== 'production') {
            handler.bind(this)();
        }
    }
    run(fn, port, ip) {
        this.runInDev(this.error);
        this.loadDefaultMiddleware();
        this.loader.load();
        return this.listen(port || this.port, ip || this.ip, () => {
            fn && fn(port || this.port, ip || this.ip);
        });
    }
    async curl(url) {
        const c = new Promise((resolve, reject) => {
            req.get(url, undefined, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve({ error, response, body });
                }
            });
        });
        return await c;
    }
    async post(url, json) {
        const c = new Promise((resolve, reject) => {
            req.post(url, { body: JSON.stringify(json) }, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve({ error, response, body });
                }
            });
        });
        return await c;
    }
}
Burn.Controller = controller_1.Controller;
Burn.Service = service_1.Service;
Burn.Blueprint = blueprint_1.bp;
exports.Burn = Burn;
