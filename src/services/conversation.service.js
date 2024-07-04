import createHttpError from "http-errors";
import { ConversationModel, UserModel } from "../models/index.js"
import mongoose from "mongoose";

export const doesConversationExist = async (sender_id, receiver_id) => {
    // console.log(sender_id+"divynahsuwa"+receiver_id);
    const senderObjectId = new mongoose.Types.ObjectId(sender_id);
    const receiverObjectId = new mongoose.Types.ObjectId(receiver_id);
    let convos = await ConversationModel.findOne({
        isGroup: false,
        $and: [
            { users: { $elemMatch: { $eq: senderObjectId } } },
            { users: { $elemMatch: { $eq: receiverObjectId } } },
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage");


    // console.log(convos.size());
    if (!convos) {
        return null;
    }


    // console.log("Yes convo find.");
    //populate message model
    convos = await UserModel.populate(convos, {  // This is to get latest message from the users
        path: "latestMessage.sender",
        select: "name email picture status",
    });

    return convos;
};

export const createConversation = async (data) => {
    const newConvo = await ConversationModel.create(data);
    if (!newConvo) {
        throw createHttpError.BadRequest("Couldn't create new convo");
    }
    return newConvo;
}

export const populateConversation = async (id, fieldToPopulate, fieldToRemove) => {
    const populatedConvo = ConversationModel.findOne({ _id: id }).populate(
        fieldToPopulate,
        fieldToRemove
    );
    if (!populatedConvo) {
        throw createHttpError.BadRequest("Couldn't populate the fields.");
    }
    return populatedConvo;
}

export const getUserConversations = async (user_id) => {
    let converstions;
    await ConversationModel.find({
        users: { $elemMatch: { $eq: user_id } },
    })
        .populate("users", "-password")
        .populate('admin', '-password')
        .populate('latestMessage')
        .sort({ updatedAt: -1 })
        .then(async (results) => {
            results = await UserModel.populate(results, {
                path: "latestMessage.sender",
                select: "name email picture status",
            });
            converstions = results;
        }).catch((err) => {
            throw createHttpError.BadRequest("OOps somethings went wrong!");
        });
    return converstions;
};

export const updateLatestMessage = async (convo_id, msg) => {
    const updatedConvo = await ConversationModel.findByIdAndUpdate(
        convo_id,
        { latestMessage: msg },
    );

    if (!updatedConvo) {
        throw createHttpError.BadRequest("Could not update latestMessage.");
    }

    return updatedConvo;
}