import express, { Request, Response, Router } from "express";
import passport from "passport";

const router: Router = express.Router();

import permit from "../middleware/permit";
import Shared from "../helpers/shared";
import AccountViewModel from "../viewModels/AccountViewModel";
// const Account = require("../models/Account");

/**
 * GET:/Auth/register.html
 */
router.get("/register", (req: Request, res: Response) => {
    return res.render("Auth/register", Shared.getModel(res, AccountViewModel));
});

/**
 * POST:/Auth/register.html
 */
router.post("/register", permit(["public"]), (req: Request, res: Response) => {
    // req.body.email = req.body.email.toLowerCase();
    // let submission = req.body;
    // let account = new LocalRegisterAccount(submission);
    // account.save((err, data) => {
    //     if (err) {
    //         res.user.error = err.errors;
    //         res.render(
    //             "Auth/register",
    //             Shared.getModel(res, LocalRegisterAccount)
    //         );
    //     } else {
    //         let body = `
    //     <h1>Verify Email</h1>
    //     <p>Hello ${submission.firstname} ${submission.lastname}!</p>
    //     <p>
    //         Your email was recently used to register for Heart & Sole Dance Studio. If this was not you please ignore this email. If it was you please follow this link:
    //     </p>
    //     <a href="${config.server.transport}://${config.server.domain}:${
    //             config.server.port
    //         }/Auth/emailConfirmation.html?id=${
    //             data._id
    //         }">Email Confirmation</a>
    //     `;
    //         Shared.sendEmail(submission.email, "Verify Email", body);
    //         return res.redirect(
    //             "/Auth/registerConfirmation.html?id=" + data._id
    //         );
    //     }
    // });
});

/**
 * GET:/Auth/login.html
 */
router.get("/login", permit(["public"]), (req: Request, res: Response) => {
    return res.render("Auth/login", Shared.getModel(res, AccountViewModel));
});

/**
 * POST:/Auth/login.html
 */
router.post("/login", passport.authenticate("local", { successRedirect: "/dashboard", failureRedirect: "/login" }));

/**
 * GET:/Auth/dashboard.html
 */
router.get("/dashboard", permit(["user"], "/Auth/login"), (req: Request, res: Response) => {
    return res.render("Auth/dashboard", Shared.getModel(res, AccountViewModel));
});

/**
 * GET:/Auth/forgotPassword.html
 */
router.get("/forgotPassword", permit(["public"]), (req: Request, res: Response) => {
    return res.render("Auth/register", Shared.getModel(res, AccountViewModel));
});

/**
 * POST:/Auth/forgotPassword.html
 */
router.post("/forgotPassword", permit(["public"]), (req: Request, res: Response) => {
    // let email = req.body.email.toLowerCase();
    // LocalRegisterAccount.findOne(
    //     { email: email, status: true },
    //     (err, data) => {
    //         if (err) throw err;
    //         if (data) {
    //             let payload = {
    //                 auth: true,
    //                 id: data._id,
    //                 exp: Math.floor(Date.now() / 1000) + 60 * 60 //1 minute
    //             };
    //             const token = Shared.tokenGen(payload);
    //             let body = `
    //     <h1>Reset Password</h1>
    //     <p>Hello ${data.firstname} ${data.lastname}!</p>
    //     <p>
    //         You recently requested your password to reset for Heart & Sole Dance Studio. If this was not you please ignore this email. If it was you please follow this link:
    //     </p>
    //     <a href="${config.server.transport}://${config.server.domain}:${
    //                 config.server.port
    //             }/Auth/resetPassword.html?token=${token}">Email Confirmation</a>
    //     `;
    //             Shared.sendEmail(data.email, "Password Reset", body);
    //         }
    //         return res.redirect("/Auth/forgotConfirmation.html");
    //     }
    // );
});

/**
 * GET:/Auth/forgotConfirmation.html
 */
router.get("/forgotConfirmation", (req: Request, res: Response) => {
    return res.render("Auth/forgotConfirmation", Shared.getModel(res, AccountViewModel));
});

/**
 * GET:/Auth/resetPassword.html:token?
 */
router.get("/resetPassword:token?", (req: Request, res: Response) => {
    // let token = Shared.tokenCheck(req.query.token);
    // if (token) {
    //     //token is valid
    //     LocalRegisterAccount.findById(token.id, (err, data) => {
    //         if (err) throw err;
    //         if (data) {
    //             data.token = req.query.token;
    //             return res.render(
    //                 "Auth/resetPassword",
    //                 Shared.getModel(res, LocalRegisterAccount, data)
    //             );
    //         }
    //     });
    // } else {
    //     //token is invalid or expired
    //     return res.render(
    //         "Auth/resetPassword",
    //         Shared.getModel(res, LocalRegisterAccount, { invalid: true })
    //     );
    // }
});

router.post("/resetPassword", (req: Request, res: Response) => {
    // let token = Shared.tokenCheck(req.body.token);
    // if (token) {
    //     let update = {
    //         password: Shared.hashString(req.body.password),
    //         updatedOn: Date.now(),
    //         updatedBy: token.id
    //     };
    //     //token is valid
    //     LocalRegisterAccount.findOneAndUpdate(
    //         { _id: token.id },
    //         update,
    //         err => {
    //             if (err) throw err;
    //             return res.redirect("/Auth/login.html");
    //         }
    //     );
    // } else {
    //     //token is invalid or expired
    //     return res.render(`
    //         "Auth/resetPassword",
    //         Shared.getModel(res, LocalRegisterAccount, { invalid: true })
    //     );
    // }
});

/**
 * GET:/Auth/logout
 */
router.get("/logout", (req: Request, res: Response) => {
    // res.clearCookie("WWW-Authenticate");
    // return res.redirect("/");
});

export default router;
