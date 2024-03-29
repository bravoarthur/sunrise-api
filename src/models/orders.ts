import { Schema, model, Model, connection, Types } from "mongoose";

export type OrderType = {
    idAdm: Types.ObjectId | string;
    userchecker?: string;
    idSuplier: Types.ObjectId | string;
    orderDate: Date;
    checkDate: Date;
    status: 'OPEN' | 'CLOSE' | 'DIVERGENT';
    listOrder: [{idProduct: string, product: string, qtd: number, image: string, divergent: boolean}];
    listCheck: [{idProduct: string, product: string, qtd: number, image: string}],
    admDesc: string,
    checkerDesc: string,        
};

const schema = new Schema<OrderType>({
    idAdm: String,
    userchecker: String,
    idSuplier: String,
    orderDate: Date,
    checkDate: Date,
    status: String,
    listOrder: [Object],
    listCheck: [Object],
    admDesc: String,
    checkerDesc: String,      
});

const modelName: string = "Order";

export default connection && connection.models[modelName]
    ? (connection.models[modelName] as Model<OrderType>)
    : model<OrderType>(modelName, schema);
