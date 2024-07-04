import createHttpError from "http-errors";
import logger from "../configs/logger.config.js";
import { doesConversationExist , createConversation ,populateConversation ,getUserConversations} from "../services/conversation.service.js";
import { findUser } from "../services/user.service.js";

export const create_open_conversation = async (req, res, next) => {
    try {
        // res.json({
        //     "message":"I am ready to talk",
        // });
        const sender_id = req.user.userId;
        const {receiver_id} = req.body;
        // res.json({
        //     "senderId":`${sender_id}`,
        //     "receiverId":`${receiver_id}`
        // });
        //check if receiver_id is provided
        if (!receiver_id) {
            logger.error("Please provide user_id which you wanna talk!");
            throw createHttpError.BadGateway("Something went Wrong!.");
        }

        // check if chats exists
        const existed_conversation = await doesConversationExist(
            sender_id, receiver_id
        );
        if (existed_conversation) {
            console.log("chal gaya bc");
            res.json(existed_conversation);
        }
        else {
            // console.log("nahi chala bc");
            let receiver_user=await findUser(receiver_id);
            let convoData = {
                name:receiver_user.name,
                picture:receiver_user.picture,
                isGroup:false,
                users:[sender_id,receiver_id],
            };
            const newConvo=await createConversation(convoData);
            // res.json(newConvo);
            const populatedConvo = await populateConversation(
                newConvo._id,"users","-password"
            );
            res.status(200).json(populatedConvo);
        }

    } catch (error) {
        next(error);
    }
}

export const getConversations = async(req,res,next)=>{
    try{
      const user_id=req.user.userId;
      const conversations=await getUserConversations(user_id);
      res.status(200).json(conversations);
    }
    catch(error){
        next(error);
    }
}