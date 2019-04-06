import { Response, Request, NextFunction } from "express";
/**
 * middleware for doing role-based permissions
 * @param allowed allowed roles
 * @param redirect redirect route if role is not permitted
 */
function permit(allowed: string[], redirect: string = "/") {
    const isAllowed = (role: string) => allowed.indexOf(role) > -1;

    return (req: Request, res: Response, next: NextFunction) => {
        if (isAllowed(res.locals.authentication.role)) next();
        else {
            res.redirect(redirect);
        }
    };
}

export default permit;
