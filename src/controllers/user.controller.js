import createHttpError from "http-errors";
import logger from "../configs/logger.config.js";
import { searchUsersServices } from "../services/user.service.js";

export const searchUsers = async(req,res,next)=>{
    try{
    //    res.send(req.query);
    
    const keyword=req.query.search;
    if(!keyword){
        logger.error("Please add a search query first.");
        throw createHttpError.BadRequest("Ooops... Something wnet wrong!");
    }
    const users=await searchUsersServices(keyword);
    res.status(200).json(users);
    }catch(error){
        next(error);
    }
}