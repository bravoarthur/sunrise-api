import { Schema, model, Model, connection } from "mongoose";

export type SuplierType = {
    name: string;
    slug: string;
    img?: string;
};

const schema = new Schema<SuplierType>({
    name: String,
    slug: String
});

const modelName: string = "Suplier";

console.log(connection.models[modelName]);

export default connection && connection.models[modelName]
    ? (connection.models[modelName] as Model<SuplierType>)
    : model<SuplierType>(modelName, schema);
