import express, { Request, Response, Router } from "express";
import passport from "passport";
import permit from "../middleware/permit";
import bcrypt from "bcryptjs"
import { RegisterViewModel } from "../viewModels/RegisterViewModel";
import { LoginViewModel } from "../viewModels/LoginViewModel";
import { View } from "../helpers/vash/view";
import Account from "../models/Account";
import { DashboardViewModel } from "../viewModels/DashboardViewModel";
import Shared from "../helpers/shared";
import { config } from "../config";
import v1 from "uuid/v1";

const router: Router = express.Router();

/**
 * POST:/Auth/register
 */
router.post("/register", permit(["public"]), (req: Request, res: Response) => {

    passport.authenticate("local-signup", { session: true }, (err, user, info) => {

        //Display any validation messages
        if (info) {
            res.locals.validation = info;
            return res.render("Auth/register", View(res, RegisterViewModel, req.body));
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
            return res.render("Auth/login", View(res, LoginViewModel, req.body));
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
    return res.render("Auth/login", View(res, LoginViewModel));
});

/**
 * GET:/Auth/register
 */
router.get("/register", permit(["public"], "/"), (req: Request, res: Response) => {
    return res.render("Auth/register", View(res, RegisterViewModel));
});


/**
 * GET:/Auth/logout
 */
router.get("/logout", (req: Request, res: Response) => {
    req.logout();
    res.redirect("/");
});

/**
 * GET:/Auth/dashboard
 */
router.get("/dashboard", permit(["user"], "/Auth/login"), (req: Request, res: Response) => {
    Account.findById(res.locals.authentication.id, { "password": 0 }, (err, data) => {
        if (err) throw err;
        return res.render("Auth/dashboard", View(res, DashboardViewModel, data));
    })
});
/**
 * POST:/Auth/changeNickname
 */
router.post("/changeNickname", permit(["user"], "/Auth/login"), (req: Request, res: Response) => {
    Account.findById(res.locals.authentication.id, (err, doc: any) => {
        doc.nickname = req.body.nickname;
        req.session.passport.user.nickname = req.body.nickname;
        doc.save()
        return res.send(doc.nickname);
    })
});

/**
 * POST:/Auth/changePassword
 */
router.post("/changePassword", permit(["user"], "/Auth/login"), (req: Request, res: Response) => {
    if (req.body.password === req.body.passwordConfirmation) {
        Account.findById(res.locals.authentication.id, (err, doc: any) => {
            doc.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8));
            doc.save();
            res.send(true);
        });

    } else {
        res.send(false);
    }
});


/**
 * GET:/Auth/confirmEmail
 */
router.get("/confirmEmail", permit(["user"]), (req: Request, res: Response) => {
    res.render("Auth/confirmEmail", View(res, DashboardViewModel));
});

/**
 * POST:/Auth/confirmEmail
 */
router.post("/confirmEmail", permit(["user"]), (req: Request, res: Response) => {
    Account.findOne({ email: req.body.email }, (err, data) => {
        if (err) throw err;

        if (data) {
            res.locals.validation = [{ message: "Email was sent", }];
            let token = v1();
            //send email
            Shared.sendEmail({
                email: req.body.email,
                subject: "B.R.T.D. Email Verification",
                body: `
                <!DOCTYPE html>
                <html>
                    <head>
                        <title>B.R.T.D. Email Verification</title>
                    </head>
                    <body>
                        <h2>B.R.T.D. Email Verification</h2>
                        <a href="${config.server.transport}://${config.server.domain}/Auth/verification?token=${token}">Verification Link</a>
                    </body>
                </html>
                `
            });
            //add token to db.
            Account.findById(res.locals.authentication.id, (err, doc: any) => {
                doc.token = token;
                doc.save();
                res.render("Auth/confirmEmail", View(res, DashboardViewModel));
            });
        } else {
            res.locals.validation = [{ message: "Email was not found." }];
            res.render("Auth/confirmEmail", View(res, DashboardViewModel));
        }
    });
});

/**
 * GET:/Auth/verification?:token
 */
router.get("/verification?:token", (req: Request, res: Response) => {
    Account.findOne({ token: req.query.token }, (err, doc: any) => {
        if (err) throw err;

        if (doc) {
            doc.confirmed = true;
            doc.save();
        } else {
            res.locals.validation = [{ message: "Invalid Token" }];
        }
        return res.render("Auth/verification");
    })
})

/**
 * POST:/Auth/forgotPassword
 */
// router.post("/forgotPassword", permit(["public"]), (req: Request, res: Response) => {});

/**
 * GET:/Auth/forgotConfirmation
 */
// router.get("/forgotConfirmation", (req: Request, res: Response) => {
// });

/**
 * GET:/Auth/resetPassword:token?
 */
// router.get("/resetPassword:token?", (req: Request, res: Response) => {});

// router.post("/resetPassword", (req: Request, res: Response) => {});

export default router;
