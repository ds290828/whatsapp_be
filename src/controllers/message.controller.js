import logger from "../configs/logger.config.js";
import { createMessage,populateMessage,getConvoMessages } from "../services/message.service.js";
import { updateLatestMessage } from "../services/conversation.service.js";

export const sendMessage = async (req, res, next) => {
    try {
        const user_id=req.user.userId;
        const { convo_id,message,files } = req.body;
        if(!convo_id  || (!message && !files)){
          logger.error('Please provide a conversaton_id and a message body');
          return res.sendStatus(400);
        }
        const msgData={
            sender:user_id,
            message,
            conversation:convo_id,
            files:files || [],
        };
        let newMessage=await createMessage(msgData);
        let populatedMessage=await populateMessage(newMessage._id);
        // console.log("Finally Reached");
        let x=await updateLatestMessage(convo_id,newMessage);
        res.json(populatedMessage);
        
    } catch (err) {
        next(err);
    }
};

export const getMessages = async (req, res, next) => {
    try {
        const convo_id=req.params.convo_id;
        if(!convo_id){
            logger.error('Please provide a conversaton_id in params');
            res.sendStatus(400);
        }
        const messages=await getConvoMessages(convo_id);
        res.json(messages);
    } catch (err) {
        next(err);
    }
};