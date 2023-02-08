import { checkSchema } from "express-validator";

const AuthValidator = {
    signup: checkSchema({
        name: {
            trim: true,
            //cut spaces from beggining and end of receiveid name
            //notEmpty: true,
            isLength: { options: { min: 2 } },
            errorMessage: "Name contains at least 2 characters"
        },
        email: {
            trim: true,
            isEmail: true,
            normalizeEmail: true,
            errorMessage: "Invalid email"
        },
        password: {
            //notEmpty: true,
            isLength: {
                options: { min: 6 }
            },
            errorMessage: "Password contains at least 6 characters"
        },
        masterPass: {
            //notEmpty: true,
            isLength: {
                options: { min: 6 }
            },
            errorMessage: "Password contains at least 6 characters"
        }

    }),

    signin: checkSchema({
        email: {
            trim: true,
            isEmail: true,
            normalizeEmail: true,
            errorMessage: "Invalid email"
        },
        password: {
            //notEmpty: true,
            isLength: {
                options: { min: 6 }
            },
            errorMessage: "Password contains at least 6 characters"
        }
    })
};

export default AuthValidator;
