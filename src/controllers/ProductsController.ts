import { Request, Response } from "express";
import User, { UserWithId } from "../models/user";
import Products from "../models/products";
import Categories from "../models/categories";
import mongoose, { isValidObjectId } from "mongoose";
import bcrypt from "bcrypt";
import validateAndGetData from "../helpers/validatorHelper";
import errorOjectHandler from "../helpers/errorObjectHandler";
import { UploadedFile } from "express-fileupload";
import addImage from "../helpers/addImage";
import { unlink } from "fs/promises";

type FilterType = {
    
    category?: string;
    name?: { [fieldname: string]: string };
};

const ProductsController = {
    
    productsList: async (req: Request, res: Response) => {   
        
        
        let { sort = "asc", offset = 0, limit = 8, q, cat, status } = req.query;
        let filters: FilterType = { };


        if (q) {
            q = q as string;
            filters.name = { $regex: q, $options: "i" };
        }

        if (cat) {
            const catFilter = await Categories.findOne({ slug: cat }).exec();
            if (catFilter) {
                filters.category = catFilter._id.toString();
            }
        }        

        const productsData = await Products.find(filters)
            .sort({ name: sort === "desc" ? -1 : 1 })
            .skip(parseInt(offset as string))
            .limit(parseInt(limit as string))
            .exec();

        let products = [];
        for (let i in productsData) {
            
            const categoryName = await Categories.findById(productsData[i].category)

            if(!categoryName) {
                res.json(errorOjectHandler('Category', 'Server Error, THERE IS A PRODUCT WITH NO CATEGORY NAME'));
                return;  
            }

            products.push({
                id: productsData[i]._id,
                name: productsData[i].name,
                category: categoryName.name,
                unit: productsData[i].unit,
                image: `${process.env.Base}/media/${productsData[i].image}`                
            });
        }
        
        res.json({productsList: products})
    },


    addProduct: async (req: Request, res: Response) => {

        let newName = ''

        if(!req.body.newProduct) {
            res.json(errorOjectHandler('Product', 'Please, provide an Product to add'));
            return;
        } else {
            newName = req.body.newProduct
        }
        
        const verifier = await Products.findOne({name: newName}).exec()
        
        if(verifier) {
            res.json(errorOjectHandler('Product', 'This Product already Exists'));
            return;
        }        

        if(!req.body.category) {
            res.json(errorOjectHandler('Product', 'Please provide a category'));
            return;            
        } 

        if(!req.body.unit) {
            res.json(errorOjectHandler('Product', 'Please provide the product unit'));
            return;            
        } 

        const newProduct = new Products({
            name: newName.toString(),
            category: req.body.category.toString(),
            unit: req.body.unit.toString(),
            image: `default.jpg`
        })

        if (req.files) {
            let imgFile = req.files.img as UploadedFile;   
            
            if (["image/jpeg", "image/jpg", "image/png"].includes(imgFile.mimetype)) {
                let url = await addImage(imgFile.data);
                newProduct.image = url                   
                
            } else {
                res.status(400);
                res.json({ error: { message: "invalid image format" } });
                return;
            }           
            
        }

        await newProduct.save()
        
        res.json({status: 'New Product Added'})
    },       

    productDelete: async (req: Request, res: Response) => {

        let idToDelete = ''
        
        if(!req.body.idProductDelete) {            
            res.json(errorOjectHandler('Product', 'Please, provide a Product to be deleted'));
            return;

        } else {
            idToDelete = req.body.idProductDelete
        }     

        if (!isValidObjectId(idToDelete)) {
            res.status(400);
            res.json({
                error: { message: "No Product selected - Check product ID" }
            });
            return;
        }


        const productDeleted = await Products.findById(idToDelete)
        if(!productDeleted) {
            res.json(errorOjectHandler('Product', 'Product not found'));
            return
        }
        
        await unlink(`./public/media/${productDeleted.image}`)
        await productDeleted.delete() 
        res.json({status: 'Product deleted'})      
    },    
};

export default ProductsController;
