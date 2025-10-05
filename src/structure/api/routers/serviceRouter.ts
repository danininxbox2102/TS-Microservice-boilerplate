import express, {Router} from "express";

const router:Router = express.Router();
export const serviceRouter = router;

router.get('/health', (req: express.Request, res: express.Response) => {
    res.status(200).json({sentAt:Date.now(),active:true});
})

router.get('/disconnect', (req: express.Request, res: express.Response) => {
    res.status(200).json({active:false});
})