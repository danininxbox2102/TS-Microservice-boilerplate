import express from 'express'
import IConfig from "@/interfaces/IConfig";
import winston from "winston";
import cookieParser from "cookie-parser";

import {serviceRouter} from "./routers/serviceRouter";
import MicroService from "@/structure/core/MicroService";
import {exampleRouter} from "@/structure/api/routers/exampleRouter";

export default class ApiServer {

    private server: express.Application
    private readonly port: number

    private readonly logger: winston.Logger
    private readonly config: IConfig

    constructor() {
        this.logger = MicroService.instance.getLogger()
        this.config = MicroService.instance.getConfig()

        this.port = this.config.apiServerPort;

        if (!this.port) {
            this.logger.error(`No apiServerPort is specified in config.json`)
            process.exit(1)
        }

        this.server = express();
        this.server.set('trust proxy', this.config.trustProxy);
        this.setupMiddleware()
        this.listen()
    }

    private setupMiddleware(){
        this.server.use(express.json())
        this.server.use(cookieParser())
        this.server.use(serviceRouter)
        this.server.use(exampleRouter)
    }

    private listen(){
        this.server.listen(this.port, () => {
            this.logger.info(`✅ API server working on port ${this.port}`);
        });
    }

}