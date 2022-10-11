import mongoose from "mongoose"

export type TokenPayload = {
    _id: mongoose.ObjectId,
    role: "admin" | "employee" | "customer"
}

export type RefreshTokenPayload ={
    _id: mongoose.ObjectId
}

export interface User {
    name: string,
    surname: string,
    email: string,
    password: string,
    googleID: string,
    accessToken: string,
    role: "admin" | "employee" | "customer",
    refreshToken: string,
}

export interface Tokens {
    accessToken: string,
    refreshToken: string
}

export interface subCategory {
    subCategories:Array<mongoose.Types.ObjectId>
    name:string
}

export interface UserDocument extends mongoose.Document,User {}

export interface CategoryDocument extends mongoose.Document,subCategory{}
  

export interface UsersModel extends mongoose.Model<UserDocument> {
    checkCredentials(email:string, plainPw:string):Promise< UserDocument | null>
}