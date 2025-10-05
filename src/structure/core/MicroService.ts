import dotenv from "dotenv";
import ApiServer from "../api/ApiServer";
import fs from "fs";
import winston from "winston";
import IConfig from "../../interfaces/IConfig";

export default class MicroService {

    static instance: MicroService;
    static readonly SERVICE_TYPE: string = "boilerplate";  //Replace with actual service type
    private logger: winston.Logger;
    private config: IConfig;

    constructor() {
        if (MicroService.instance) {
            return MicroService.instance;
        }
        MicroService.instance = this;

        this.setup().then()
    }
    // Инициализация
    private async setup() {
        this.createLogger()
        this.loadConfig()
        new ApiServer()
        await this.connect();
    }

    // Загрузка файла конфигурации
    private loadConfig() {
        dotenv.config({path: './config/secret.env'})

        const configPath = "./config/config.json"

        if (!fs.existsSync(configPath)) {
            // Завершаем процесс т.к. Нет конфига
            this.logger.error("Config not found!")
            process.exit(1)
        }

        try {
            // Читаем json файл, и парсим строку в объект
            this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        } catch (e: any) {
            this.logger.error(`Failed to parse config: ${e}`)
            process.exit(1)
        }

    }

    // Настройка logger'а
    private createLogger() {
        this.logger  = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            transports: [
                new winston.transports.File({ filename: './log/combined.log' }),
            ],
        });

        this.logger.add(new winston.transports.Console({
            format: winston.format.cli(),
        }));
    }

    /**
     * Подключение к API Gateway
     */
    private async connect() {
        const gatewayUrl = this.config.gatewayUrl
        const port = this.config.apiServerPort
        if (!gatewayUrl) {
            this.logger.error(`No gatewayUrl is specified in config.json`)
            process.exit(1)
        }

        if (!port) {
            this.logger.error(`No apiServerPort is specified in config.json`)
            process.exit(1)
        }

        try {
            this.logger.info("⌛ Connecting to gateway...")

            const ip = "http://localhost";

            const response = await fetch(gatewayUrl+"/register", {
                method: "post",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({type: MicroService.SERVICE_TYPE, ip: ip + ":" + port})
            });

            const data = await response.json();
            if (data.success) {
                this.logger.info("✅ Connected to gateway")
            }
        } catch (e: any) {
            this.logger.error(`Failed to connect to the API Gateway: ${e}`);
            process.exit(1);
        }
    }

    public getLogger(){
        return this.logger;
    }

    public getConfig(){
        return this.config;
    }
}