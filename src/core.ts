import * as Koa from 'koa';
import { Loader } from './loader';
import logger from './logger';
import { Controller } from './base/controller';
import { Service } from './base/service';


export interface KV {
    [key: string]: any
}

export class Burn extends Koa {
    private loader: Loader;
    private port: number;
    private ip: string;
    static Controller: typeof Controller = Controller;
    static Service: typeof Service = Service;

    config: KV = {};

    constructor() {
        super();
        this.loader = new Loader(this);
        this.port = 3000;
        this.ip = '127.0.0.1';
    }

    run() {
        this.loader.load();
        this.listen(this.port, this.ip, () => {
            logger.green(`Burn服务器运行在:${this.ip}:${this.port}`)
        })
    }
}