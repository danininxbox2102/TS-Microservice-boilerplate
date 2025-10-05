import express, {Router} from "express";
import ExampleHandler from "@/structure/api/routers/handlers/ExampleHandler";

const router:Router = express.Router();
export const exampleRouter = router;

// Example route with handler
router.get('/', new ExampleHandler().handle)
