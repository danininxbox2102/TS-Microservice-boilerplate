import express from "express";

export default abstract class IApiHandler {

    abstract handle(req: express.Request, res: express.Response):void
}