import mongoose from 'mongoose';
const { Schema, model, models, Types } = mongoose;
const { ObjectId } = Types;

const messageSchema = new Schema({
   sender: {
      type: ObjectId,
      ref: "UserModel",
   },
   message: {
      type: String,
      trim: true,
   },
   conversation: {
      type: ObjectId,
      ref: "ConversationModel",
   },
   files: [],
}, {
    collection: "messages",
    timestamps: true,
});

const MessageModel = models.MessageModel || model("MessageModel", messageSchema);

export default MessageModel;
