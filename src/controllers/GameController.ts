import express, { Request, Response, Router } from "express";
import permit from "../middleware/permit";
const router: Router = express.Router();

/**
 * GET:/index
 */
router.get("/index", permit(["user", "admin"], "/auth/login"), (req: Request, res: Response) => {
    res.render("Game/index");
});

/**
 * GET:/index
 */
router.get("/", permit(["user", "admin"], "/auth/login"), (req: Request, res: Response) => {
    res.render("Game/index");
});

export default router;
