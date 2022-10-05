import mongoose from "mongoose"

export type TokenPayload = {
    _id: mongoose.ObjectId,
    role: "admin" | "employee" | "customer"
}

export interface User {
    name: string,
    surname: string,
    email: string,
    password: string,
    googleID: string,
    accessToken: string,
    role: "admin" | "employee" | "customer"
}

export interface UserDocument extends mongoose.Document,User {}
  

export interface UsersModel extends mongoose.Model<UserDocument> {
    checkCredentials(email:string, plainPw:string):Promise< UserDocument | null>
}