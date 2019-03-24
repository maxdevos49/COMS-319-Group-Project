import express, { Request, Response, Router } from "express";
const router: Router = express.Router();

/**
 * GET:/index
 */
router.get("/index", (req: Request, res: Response) => {
    res.render("Game/index");
});

/**
 * GET:/index
 */
router.get("/", (req: Request, res: Response) => {
    res.render("Game/index");
});

export default router;
