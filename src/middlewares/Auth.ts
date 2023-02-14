import passport from "passport";
import { Request, Response, NextFunction } from "express";
import mypassport from "../config/passport";

//const notAuthorizedJson = { status: 401, message: "Not Authorized" };

const notAuthorizedJson = { status: 401, error: {param: 'Login Error', msg: 'Not Authorized - Login Again'}}

const Auth = {
    private: (req: Request, res: Response, next: NextFunction) => {
        const authFunction = passport.authenticate("jwt", (err, user) => {
            req.user = user;

            if (user) {
                next();
            } else {
                next(notAuthorizedJson);
            }
        });
        authFunction(req, res, next);
    }
};

export default Auth;

