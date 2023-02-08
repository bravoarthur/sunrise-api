import { Request, Response } from "express";
import User, { UserWithId } from "../models/user";
import Categories from "../models/categories";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validateAndGetData from "../helpers/validatorHelper";
import errorOjectHandler from "../helpers/errorObjectHandler";


const CategoryController = {
    
    userList: async (req: Request, res: Response) => {        
        const userList = await User.find()
        res.json({userList: userList})
    },

    userDelete: async (req: Request, res: Response) => {

        let idToDelete = ''
        
        if(!req.body.idUserDelete) {            
            res.json(errorOjectHandler('user', 'Please, provide a user to be deleted'));
            return;

        } else {
            idToDelete = req.body.idUserDelete
        }

        if(!req.body.idUser) {
            res.json(errorOjectHandler('user', 'Please, login before delete an user'));
            return;
        }

        if(req.body.idUser === idToDelete) {
            res.json(errorOjectHandler('user', 'You cannot delete the user you are logged. Please log with another user to Delete'));
            return;
        }

        const user = await User.findById(idToDelete)
        if(!user) {
            res.json(errorOjectHandler('user', 'user not found'));
            return
        }
        await user.delete() 
        res.json({status: 'user deleted'})      
    },    
};

export default CategoryController;
