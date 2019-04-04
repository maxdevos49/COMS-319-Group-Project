import express, { Request, Response, Router } from "express";
import passport from "passport";

const router: Router = express.Router();

import permit from "../middleware/permit";
import Shared from "../helpers/shared";

import RegisterViewModel from "../viewModels/RegisterViewModel";
import LoginViewModel from "../viewModels/LoginViewModel";

/**
 * POST:/Auth/register.html
 */
router.post(
    "/register",
    permit(["public"], "/"),
    passport.authenticate("local-signup", {
        successRedirect: "/dashboard",
        failureRedirect: "/register"
    })
);

/**
 * POST:/Auth/login.html
 */
router.post(
    "/login",
    permit(["public"], "/"),
    passport.authenticate("local-login", {
        successRedirect: "/dashboard",
        failureRedirect: "/login"
    })
);

/**
 * GET:/Auth/login.html
 */
router.get("/login", permit(["public"], "/"), (req: Request, res: Response) => {
    return res.render("Auth/login", Shared.getModel(res, LoginViewModel));
});

/**
 * GET:/Auth/register.html
 */
router.get("/register", permit(["public"], "/"), (req: Request, res: Response) => {
    return res.render("Auth/register", Shared.getModel(res, RegisterViewModel));
});

/**
 * GET:/Auth/dashboard.html
 */
router.get("/dashboard", permit(["user"], "/Auth/login"), (req: Request, res: Response) => {
    return res.render("Auth/dashboard", Shared.getModel(res, RegisterViewModel));
});

/**
 * GET:/Auth/logout
 */
router.get("/logout", (req: Request, res: Response) => {
    req.logout();
    res.redirect("/");
});

/**
 * GET:/Auth/forgotPassword.html
 */
// router.get("/forgotPassword", permit(["public"]), (req: Request, res: Response) => {
//     return res.render("Auth/register", Shared.getModel(res, RegisterViewModel));
// });

/**
 * POST:/Auth/forgotPassword.html
 */
// router.post("/forgotPassword", permit(["public"]), (req: Request, res: Response) => {});

/**
 * GET:/Auth/forgotConfirmation.html
 */
// router.get("/forgotConfirmation", (req: Request, res: Response) => {
//     return res.render("Auth/forgotConfirmation", Shared.getModel(res, RegisterViewModel));
// });

/**
 * GET:/Auth/resetPassword.html:token?
 */
// router.get("/resetPassword:token?", (req: Request, res: Response) => {});

// router.post("/resetPassword", (req: Request, res: Response) => {});

export default router;
