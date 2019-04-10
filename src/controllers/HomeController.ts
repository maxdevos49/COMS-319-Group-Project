import express, { Request, Response, Router } from "express";
const router: Router = express.Router();
import { config } from "../config";


/**
 * GET:/index
 */
router.get("/index", (req: Request, res: Response) => {
	res.render("Home/index");
});

/**
 * GET:/index
 */
router.get("/", (req: Request, res: Response) => {
	res.render("Home/index");
});

/**
 * GET:/about
 */
router.get("/about", (req: Request, res: Response) => {
	res.render("Home/about", { config: config });
});

/**
 * GET:/changelog
 */
router.get("/changelog", (req: Request, res: Response) => {
	res.render("Home/changelog");
});

export default router;
