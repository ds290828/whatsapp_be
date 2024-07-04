import createHttpError from "http-errors";
import { UserModel } from "../models/index.js";

export const findUser = async(userId)=>{
    const user= await UserModel.findById(userId);
    if(!user){
        throw createHttpError.BadRequest("Please fill all the fields.");
    }
    return user;
}

export const searchUsersServices=async(keyword)=>{
    const users=UserModel.find({
        $or:[
            {name:{$regex:keyword, $options: "i"}},
            {email:{$regex:keyword, $options: "i"}},
        ],
    });
    return users;
}


