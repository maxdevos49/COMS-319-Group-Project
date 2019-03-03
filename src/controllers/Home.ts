import express, { Request, Response, Router } from "express";
const router: Router = express.Router();

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
    res.render("Home/about");
});

export default router;
