import { Request, Response } from "express";
import User, { UserWithId } from "../models/user";
import Suplier from "../models/suplier";
import mongoose, { isValidObjectId } from "mongoose";
import bcrypt from "bcrypt";
import validateAndGetData from "../helpers/validatorHelper";
import errorOjectHandler from "../helpers/errorObjectHandler";


const SuplierController = {
    
    suplierList: async (req: Request, res: Response) => {        
        const suplierList = await Suplier.find().exec()
        res.json({suplierList: suplierList})
    },

    addSuplier: async (req: Request, res: Response) => {

        let newName = ''

        if(!req.body.newSuplier) {
            res.json(errorOjectHandler('Suplier', 'Please, provide a Suplier to add'));
            return;
        } else {
            newName = req.body.newSuplier
        }
        
        const verifier = await Suplier.findOne({name: newName}).exec()
        
        if(verifier) {
            res.json(errorOjectHandler('Suplier', 'This Suplier already Exists'));
            return;
        }

        const slug = newName.replace(/\s/g, '').toLowerCase()
        
        const newSuplier = new Suplier({
            name: newName,
            slug: slug
        })
        await newSuplier.save()
        
        res.json({status: 'New Suplier Added'})
    },



    suplierDelete: async (req: Request, res: Response) => {

        let idToDelete = ''
        
        if(!req.body.idSuplierDelete) {            
            res.json(errorOjectHandler('Suplier', 'Please, provide a Suplier to be deleted'));
            return;

        } else {
            idToDelete = req.body.idSuplierDelete
        }     

        if (!isValidObjectId(idToDelete)) {
            res.status(400);
            res.json({
                error: { message: "No Product selected - Check product ID" }
            });
            return;
        }


        const suplierDeleted = await Suplier.findById(idToDelete)
        if(!suplierDeleted) {
            res.json(errorOjectHandler('Suplier', 'Suplier not found'));
            return
        }
        await suplierDeleted.delete() 
        res.json({status: 'Suplier deleted'})      
    },    
};

export default SuplierController;
