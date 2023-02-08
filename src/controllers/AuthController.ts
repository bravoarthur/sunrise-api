import { Request, Response } from "express";
import User from "../models/user";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generateToken from "../helpers/generateToken";
import validateAndGetData from "../helpers/validatorHelper";
import errorOjectHandler from "../helpers/errorObjectHandler";

const AuthController = {
    signin: async (req: Request, res: Response) => {
        const data = await validateAndGetData(req, res);
        if (!data) return;

        const user = await User.findOne({
            email: data.email
        });
        ////Email check/////////////////////////////
        if (!user) {
            res.status(400);
            res.json(errorOjectHandler('email', 'Email or password invalid'));
            return;
        }
        /////password check ///////////////////////

        const match = await bcrypt.compare(data.password, user.passwordHash);
        if (!match) {
            res.status(400);
            res.json(errorOjectHandler('password', 'Email or password invalid'));
            return;
        }

        const token = await generateToken({ id: user._id });
        user.token = token;
        await user.save();

        res.status(200);
        res.json({ signup: "ok", token: token, email: user.email });
    },

    signup: async (req: Request, res: Response) => {
        const data = await validateAndGetData(req, res);
        if (!data) return;

        //Server MASTERPASS CHECK
        if(!data.masterPass) {
            res.status(400);
            res.json(errorOjectHandler('MasterPass', "Please, provide MasterPass"));
            return;
        }

        if(data.masterPass !== process.env.SERVER_MASTER_PASSWORD) {
            res.status(400);
            res.json(errorOjectHandler('MasterPass', "Master Password is invalid"));
            return;
        }

        ////email check/////////////////////
        const useremail = await User.findOne({
            email: data.email
        });

        if (useremail) {
            res.status(400);
            res.json(errorOjectHandler('email', "Email already exists"));
            return;
        }   

        ////add//////////////////////////////////////////////////

        const passwordHash = await bcrypt.hash(data.password, 10);
        //const payload = (Date.now() + Math.random()).toString()
        //const token = await bcrypt.hash(payload as string, 10)
        let token = "";

        const newUser = new User({
            name: data.name,
            email: data.email,           
            passwordHash: passwordHash,
            token: token
        });

        token = await generateToken({ id: newUser._id });
        newUser.token = token;

        await newUser.save();
        res.status(201);
        res.json({ signup: "ok", token: token });
    }
};

export default AuthController;
