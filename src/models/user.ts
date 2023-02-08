import { Schema, model, Model, connection } from "mongoose";

export type UserType = {
    
    name: string,
    email: string,    
    passwordHash: string,
    token: string
} 

export interface UserWithId extends UserType {
    _id: string
}


const schema = new Schema<UserType>({
    name: String,
    email: String,    
    passwordHash: String,
    token: String
    
})

const modelName: string = 'User'

console.log(connection.models[modelName])


export default (connection && connection.models[modelName]) ? connection.models[modelName] as Model<UserType> : model<UserType>(modelName, schema)


/*
    name: {type: String, required: true},
    email: {type: String, required: true},
    state: {type: String, required: true},
    passwordHash: {type: String, required: true},
    token: {type: String, required: true},
*/