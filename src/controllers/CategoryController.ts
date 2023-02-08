import { Request, Response } from "express";
import User, { UserWithId } from "../models/user";
import Categories from "../models/categories";
import mongoose, { isValidObjectId } from "mongoose";
import bcrypt from "bcrypt";
import validateAndGetData from "../helpers/validatorHelper";
import errorOjectHandler from "../helpers/errorObjectHandler";


const CategoryController = {
    
    categoryList: async (req: Request, res: Response) => {        
        const categoryList = await Categories.find().exec()
        res.json({categoryList: categoryList})
    },

    addCategory: async (req: Request, res: Response) => {

        let newName = ''

        if(!req.body.newCategory) {
            res.json(errorOjectHandler('Category', 'Please, provide a Category to add'));
            return;
        } else {
            newName = req.body.newCategory
        }
        
        const verifier = await Categories.findOne({name: newName}).exec()
        
        if(verifier) {
            res.json(errorOjectHandler('Category', 'This Category already Exists'));
            return;
        }

        const slug = newName.replace(/\s/g, '').toLowerCase()
        console.log(slug)
        const newCategory = new Categories({
            name: newName,
            slug: slug
        })
        await newCategory.save()
        
        res.json({status: 'New Category Added'})
    },



    categoryDelete: async (req: Request, res: Response) => {

        let idToDelete = ''
        
        if(!req.body.idCategoryDelete) {            
            res.json(errorOjectHandler('Category', 'Please, provide a Category to be deleted'));
            return;

        } else {
            idToDelete = req.body.idCategoryDelete
        } 
        
        if (!isValidObjectId(idToDelete)) {
            res.status(400);
            res.json({
                error: { message: "No Category selected - Check Category ID" }
            });
            return;
        }

        const categoryDeleted = await Categories.findById(idToDelete)
        if(!categoryDeleted) {
            res.json(errorOjectHandler('Category', 'Category not found'));
            return
        }
        await categoryDeleted.delete() 
        res.json({status: 'Category deleted'})      
    },    
};

export default CategoryController;
