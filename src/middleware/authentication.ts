import { Request, Response, NextFunction } from "express";

export function authentication(req: Request, res: Response, next: NextFunction) {
    if (!req.session || !req.session.passport || !req.session.passport.user) {
        res.locals = {
            authentication: {
                role: "public"
            }
        };
        return next();
    }

    res.locals = {
        authentication: {
            id: req.session.passport.user.id,
            nickname: req.session.passport.user.nickname,
            role: req.session.passport.user.role
        }
    };

    next();
}
