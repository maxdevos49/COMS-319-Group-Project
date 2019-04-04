import express, { Request, Response, Router } from "express";
const router: Router = express.Router();
import config from "../config";
import Shared from "../helpers/shared";

/**
 * GET:/index
 */
router.get("/index", (req: Request, res: Response) => {
    res.render("Home/index", Shared.getModel(res));
});

/**
 * GET:/index
 */
router.get("/", (req: Request, res: Response) => {
    res.render("Home/index", Shared.getModel(res));
});

/**
 * GET:/about
 */
router.get("/about", (req: Request, res: Response) => {
    res.render("Home/about", Shared.getModel(res));
});

/**
 * GET:/changelog
 */
router.get("/changelog", (req: Request, res: Response) => {
    res.render("Home/changelog", Shared.getModel(res));
});

export default router;
