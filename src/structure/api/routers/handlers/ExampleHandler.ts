import IApiHandler from "@/interfaces/IApiHandler";
import {Request, Response} from "express";

export default class ExampleHandler implements IApiHandler {

    async handle(req: Request, res: Response) {

        res.status(200).send("Hello from example microservice!");
    }
}