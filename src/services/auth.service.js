import createHttpError from "http-errors";
import validator from "validator";
import bcrypt from 'bcrypt';
import { UserModel } from "../models/index.js";


//env variables
const { DEFAULT_PICTURE, DEFAULT_STATUS } = process.env;
console.log(DEFAULT_PICTURE, DEFAULT_STATUS);

export const createUser = async (userData) => {
    const { name, email, picture, status, password } = userData;

    //check if fields are empty.
    if (!name || !email || !password) {
        throw createHttpError.BadRequest("please fill all the required field.");
    }

    //check name length
    if (!validator.isLength(name, {
        min: 3,
        max: 20,
    })) {
        throw createHttpError.BadRequest("length of name  should be in between 3 to 20 characters long");
    }

    //check status length
    if (status && status.length > 64) {
        throw createHttpError.BadRequest("status should be less than 64 characters long");
    }

    //check if email address is valid.
    if (!validator.isEmail(email)) {
        throw createHttpError.BadRequest("please enter a valid email address.");
    }

    //check if user already exist
    const checkDb = await UserModel.findOne({ email });
    if (checkDb) {
        throw createHttpError.Conflict("Please try again with different email address.This email is already exist.");
    }

    //check password length
    if (!validator.isLength(password, {
        min: 6,
        max: 128,
    })) {
        throw createHttpError.BadRequest("password should be in between 6 to 128 characters long");
    }

    //hash password ---> to be done in user model


    //adding user to database
    const user = await new UserModel({
        name,
        email,
        picture: picture || DEFAULT_PICTURE,
        status: status || DEFAULT_STATUS,
        password,
    }).save();

    return user;



}

export const signUser = async (email, password) => {
    const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();
    //check if email exist.
    if (!user) {
        throw createHttpError.NotFound("Invalid credentials");
    }
    // console.log(email+" "+password);
    //compare passwords
    let isMatch = await bcrypt.compare(password, user.password);
    // console.log("divyanshu"+isMatch);
    if (!isMatch) {
        throw createHttpError.Unauthorized("Invalid email or password");
    }
    // console.log(user);
    return user;
}