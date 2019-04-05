import express, { Request, Response, Router, response } from "express";
import passport from "passport";

const router: Router = express.Router();

import permit from "../middleware/permit";
import Shared from "../helpers/shared";

import RegisterViewModel from "../viewModels/RegisterViewModel";
import LoginViewModel from "../viewModels/LoginViewModel";

/**
 * POST:/Auth/register
 */
router.post("/register", permit(["public"]), (req: Request, res: Response) => {

    passport.authenticate("local-signup", { session: true }, (err, user, info) => {

        //Display any validation messages
        if (info) {
            res.locals.validation = info;
            return res.render("Auth/register", Shared.getModel(res, RegisterViewModel, req.body));
        }

        return res.redirect("/auth/dashboard");

    })(req, res)
});

/**
 * POST:/Auth/login
 */
router.post("/login", permit(["public"]), (req: Request, res: Response) => {
    passport.authenticate("local-login", { session: true }, (err, user, info) => {

        //Display any validation messages
        if (info) {
            res.locals.validation = info;
            return res.render("Auth/login", Shared.getModel(res, LoginViewModel, req.body));
        }

        req.login(user, (err) => {
            return res.redirect("/auth/dashboard");
        });

    })(req, res)
});

/**
 * GET:/Auth/login
 */
router.get("/login", permit(["public"], "/"), (req: Request, res: Response) => {
    return res.render("Auth/login", Shared.getModel(res, LoginViewModel));
});

/**
 * GET:/Auth/register
 */
router.get("/register", permit(["public"], "/"), (req: Request, res: Response) => {
    return res.render("Auth/register", Shared.getModel(res, RegisterViewModel));
});

/**
 * GET:/Auth/dashboard
 */
router.get("/dashboard", permit(["user"], "/Auth/login"), (req: Request, res: Response) => {
    return res.render("Auth/dashboard");
});

/**
 * GET:/Auth/logout
 */
router.get("/logout", (req: Request, res: Response) => {
    req.logout();
    res.redirect("/");
});

/**
 * GET:/Auth/forgotPassword
 */
// router.get("/forgotPassword", permit(["public"]), (req: Request, res: Response) => {
//     return res.render("Auth/register", Shared.getModel(res, RegisterViewModel));
// });

/**
 * POST:/Auth/forgotPassword
 */
// router.post("/forgotPassword", permit(["public"]), (req: Request, res: Response) => {});

/**
 * GET:/Auth/forgotConfirmation
 */
// router.get("/forgotConfirmation", (req: Request, res: Response) => {
//     return res.render("Auth/forgotConfirmation", Shared.getModel(res, RegisterViewModel));
// });

/**
 * GET:/Auth/resetPassword:token?
 */
// router.get("/resetPassword:token?", (req: Request, res: Response) => {});

// router.post("/resetPassword", (req: Request, res: Response) => {});

export default router;
