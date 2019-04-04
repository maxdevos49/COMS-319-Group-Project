import passport from "passport";
import LocalStrategy from "passport-local";
import AccountViewModel from "../viewModels/AccountViewModel";
import Account from "../models/Account";

passport.use(
    new LocalStrategy.Strategy(function(username: string, password: string, done: any) {
        Account.findOne({ username: username }, function(err: any, user: any) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            // if (!Account.verifyPassword(password)) {
            //     return done(null, false);
            // }
            return done(null, user);
        });
    })
);

passport.serializeUser(function(user: any, done: any) {
    done(null, user.id);
});
passport.deserializeUser(function(id: any, done: any) {
    Account.findOne(
        {
            _id: id
        },
        "-password -salt",
        function(err: any, user: any) {
            done(err, user);
        }
    );
});
