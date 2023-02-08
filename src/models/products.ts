import { Schema, model, Model, connection, Types } from "mongoose";

export type ProductsType = {
    category: string;
    name: string;
    unit: "Kg" | 'Bag' | 'Tray' | 'Box' | 'Unit' | 'Default';
    image: string;    
};

const schema = new Schema<ProductsType>({
    category: String,
    name: String,
    unit: String,
    image: String,    
});

const modelName: string = "Products";

export default connection && connection.models[modelName]
    ? (connection.models[modelName] as Model<ProductsType>)
    : model<ProductsType>(modelName, schema);
