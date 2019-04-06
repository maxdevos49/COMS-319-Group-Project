import LocalStrategy from "passport-local";
import Account, { IAccount } from "../models/Account";
import { Request } from "express";
import bcrypt from "bcryptjs";

export default function (passport: any) {
    /**
     * Serialize a user(save into session)
     */
    passport.serializeUser(function (user: IAccount, done: Function) {
        done(null, {
            id: user.id,
            nickname: user.nickname,
            role: user.role
        });
    });

    /**
     * Deserialize a user(Read from session)
     */
    passport.deserializeUser(function (user: IAccount, done: Function) {
        done(null, user);
    });

    /**
     * Register strategy
     */
    passport.use(
        "local-signup",
        new LocalStrategy.Strategy(
            {
                usernameField: "email",
                passwordField: "password",
                passReqToCallback: true
            },
            function (req: Request, email: string, password: string, done: Function) {
                Account.findOne({ email: email.toLowerCase() }, function (err: any, user: any) {
                    // if there are any errors, return the error
                    if (err) return done(err, null, [{ message: "Logins are done for the moment D:" }]);

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, [{ message: "That email is already taken." }]);
                    } else {
                        let newUser: any = new Account();

                        newUser.nickname = req.body.nickname;
                        newUser.email = email;
                        newUser.role = "user";
                        newUser.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8));

                        // save the user
                        newUser.save(function (err: any) {
                            if (err) throw err;
                            return done(null, newUser);
                        });
                    }
                });
            }
        )
    );

    /**
     * Login strategy
     */
    passport.use(
        "local-login",
        new LocalStrategy.Strategy(
            {
                usernameField: "email",
                passwordField: "password",
                passReqToCallback: true
            },
            function (req: Request, email: string, password: string, done: Function) {
                // we are checking to see if the user trying to login already exists
                Account.findOne({ email: email }, function (err: any, user: any) {
                    // if there are any errors, return the error before anything else
                    if (err) return done(err, null, [{ message: "Logins are done for the moment D:" }]);

                    // if no user is found, return the message
                    if (!user) return done(null, false, [{ message: "No user found." }]);

                    // if the user is found but the password is wrong
                    if (!bcrypt.compareSync(password, user.password)) return done(null, false, [{ message: "Oops! Wrong password." }]);

                    // all is well, return successful user
                    return done(null, user);
                });
            }
        )
    );
}
