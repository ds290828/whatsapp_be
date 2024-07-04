import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt'

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please provide your name"],
    },
    email:{
        type:String,
        required:[true,"Please provide your email address"],
        unique:[true,"This email address already exist"],
        lowercase:true,
        validate:[validator.isEmail,"Please provide a valid email address"],
    },
    picture:{
        type:String,
        default:"https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg",
    },
    status:{
        type:String,
        default:"Hey There ! I am using Whatsapp.",
    },
    password:{
        type:String,
        required:[true,"Please provide your password"],
        minlength:[6,"Please make sure your Password should be at least 6 characters long."],
        maxlength:[128,"Please make sure your Password should be less 128 characters long."],
    },
},
{
  collection:"users",
  timestamps:true,
}
);
userSchema.pre('save',async function(next){
    try{
        if(this.isNew){
          const salt = await bcrypt.genSalt(12);
          const hashpassword = await bcrypt.hash(this.password,salt);
          this.password = hashpassword;
        }
        next();
    }catch(error){
        next(error);
    }
})

const UserModel=mongoose.models.UserModel || mongoose.model("UserModel",userSchema);
export default UserModel;