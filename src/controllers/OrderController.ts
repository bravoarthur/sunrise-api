import { Request, Response } from "express";
import User, { UserWithId } from "../models/user";
import Products from "../models/products";
import Categories from "../models/categories";
import Suplier from "../models/suplier"
import mongoose, { isValidObjectId } from "mongoose";
import bcrypt from "bcrypt";
import validateAndGetData from "../helpers/validatorHelper";
import errorOjectHandler from "../helpers/errorObjectHandler";
import { UploadedFile } from "express-fileupload";
import addImage from "../helpers/addImage";
import { unlink } from "fs/promises";
import Orders from "../models/orders"

type FilterType = {
    status?: "OPEN" | 'CLOSE' | "DIVERGENT",
    suplier?: string;
    name?: { [fieldname: string]: string };
};

type ListOrder = {
    idProduct: string,
    product: string, 
    qtd: number,
    image: string,
    divergent: boolean
}


const OrderController = {
    
    orderList: async (req: Request, res: Response) => {         
        
        let { sort = "asc", offset = 0, limit = 8, suplier, status = 'OPEN' } = req.query;
        let filters: FilterType = { };

        if(status) {
            if(status === "OPEN" || status === "CLOSE" || status === "DIVERGENT" )            
            filters.status = status 
        }

       
        if (suplier) {
            const suplierFilter = await Suplier.findOne({ slug: suplier }).exec();
            if (suplierFilter) {
                filters.suplier = suplierFilter._id.toString();
            }
        }        

        const orderData = await Orders.find(filters)
            .sort({ orderDate: sort === "desc" ? -1 : 1 })
            .skip(parseInt(offset as string))
            .limit(parseInt(limit as string))
            .exec();

        let orders = [];
        for (let i in orderData) {
            
            const suplierName = await Suplier.findById(orderData[i].idSuplier)

            if(!suplierName) {
                res.json(errorOjectHandler('Category', 'Server Error, THERE IS A PRODUCT WITH NO CATEGORY NAME'));
                return;  
            }

            orders.push({
                id: orderData[i]._id,
                suplier: suplierName.name,
                orderDate: orderData[i].orderDate,
                checkDate: orderData[i].checkDate? orderData[i].checkDate: '',
                userchecker: orderData[i].userchecker? orderData[i].userchecker: '',
                listOrder: orderData[i].listOrder,
                listCheck: orderData[i].listCheck ? orderData[i].listCheck : [],
                admDesc: orderData[i].admDesc ? orderData[i].admDesc : '',
                checkerDesc: orderData[i].checkerDesc ? orderData[i].checkerDesc : '',  
            });
        }
        
        res.json({orderList: orders})
    },


    addOrder: async (req: Request, res: Response) => {

        /*if(!req.body.order){
            res.json(errorOjectHandler('Order', 'Please send an Order'));
            return;  
        }*/

        const {idAdm, idSuplier, listOrder, desc } = req.body
        
        if(!isValidObjectId(idAdm) || !idAdm ) {
            res.json(errorOjectHandler('Order', 'Invalid user ID'));
            return; 
        }

        if(!isValidObjectId(idSuplier) || !idSuplier ) {
            res.json(errorOjectHandler('Order', 'Invalid Suplier ID'));
            return; 
        }

        if(listOrder.length === 0) {
            res.json(errorOjectHandler('Order', 'The List has no Product'));
            return; 
        }                   

        const newOrder = new Orders({
            idAdm: idAdm.toString(),
            idSuplier: idSuplier.toString(),
            orderDate: new Date(),
            status: 'OPEN',
            listOrder: listOrder,
            admDesc: desc? desc : '',     
            
        })   

        await newOrder.save()  
        res.json({status: 'Order Added'})          
        
    },

    addCheck: async (req: Request, res: Response) => {        

        const {userChecker, checkOrder, idOrder, checkerDesc, status, divergent } = req.body

        if(!isValidObjectId(idOrder) || !idOrder ) {
            res.json(errorOjectHandler('Order', 'Invalid user ID'));
            return; 
        }        
        if(!userChecker ) {
            res.json(errorOjectHandler('Order', 'Invalid user checker name'));
            return; 
        }        

        if(checkOrder.length === 0) {
            res.json(errorOjectHandler('Order', 'The List has no Product'));
            return; 
        }

        const verifier = await Orders.findById(idOrder)
        if(!verifier) {
            res.json(errorOjectHandler('Order', 'The order Doesnt Exist'));
            return;
        }
        
        let listWithDivergences: ListOrder[] = []
        if(divergent) {
            if(divergent.length > 0) {
                listWithDivergences = verifier.listOrder.map((item, index) => {
                    if(divergent.includes(index)) {
                        item.divergent = true
                        return item
                    } else {
                        return item
                    }
                })

            }
        }              

        const updates = {
            userchecker: userChecker,
            listCheck: checkOrder,
            status: status,
            checkDate: new Date(),
            checkerDesc: checkerDesc ? checkerDesc : '',
            listOrder: listWithDivergences.length>0 ? listWithDivergences : verifier.listOrder,
            
        }
        
        await Orders.findByIdAndUpdate(idOrder, {$set:updates})
               
        res.json({status: 'Order Updated'})          
        
    },
    
    finish: async (req: Request, res: Response) => {        

        const { idOrder } = req.body

        if(!isValidObjectId(idOrder) || !idOrder ) {
            res.json(errorOjectHandler('Order', 'Invalid user ID'));
            return; 
        }        
        
        const verifier = await Orders.findById(idOrder)
        if(!verifier) {
            res.json(errorOjectHandler('Order', 'The order Doesnt Exist'));
            return;
        }

        const updates = {            
            status: 'CLOSE',                       
        }

        
        await Orders.findByIdAndUpdate(idOrder, {$set:updates})
               
        res.json({status: 'Order Finished'})          
        
    },
    
    orderItem: async (req: Request, res: Response) => {        

        /*let idOrder = ''
        idOrder = req.params.id*/
        const {id} = req.params

        if(!isValidObjectId(id) || !id ) {
            res.json(errorOjectHandler('Order', 'Invalid user ID'));
            return; 
        }       
        
        const order = await Orders.findById(id)
        if(!order) {
            res.json(errorOjectHandler('Order', 'The order Doesnt Exist'));
            return;
        }  
        
        const suplier = await Suplier.findById(order.idSuplier)
        if(!suplier) {
            res.json(errorOjectHandler('Order', 'The order Doesnt Exist'));
            return;
        }
        
        const orderResponse = {
            _id: order._id,
            idSuplier: order.idSuplier,
            suplierName: suplier.name,
            idAdm: order.idAdm,
            userchequer: order.userchecker? order.userchecker : '',
            orderDate: order.orderDate,
            checkDate: order.checkDate? order.checkDate : '',
            status: order.status,
            listOrder: order.listOrder,
            listCheck: order.listCheck ? order.listCheck : [],
            admDesc: order.admDesc ? order.admDesc : '',
            checkerDesc: order.checkerDesc ? order.checkerDesc : ''
        }
               
        res.json({order: order})          
        
    },

    /*
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
    },    */
};

export default OrderController;
