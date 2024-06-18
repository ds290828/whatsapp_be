import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import compression from "compression";
import fileUpload from "express-fileupload";
import cors from "cors";
import createHttpError from 'http-errors';
import routes from './routes/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

//Dotenv config for accessing the variable that we define .dotenv file.
// dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load .env file from the src directory
dotenv.config({ path: path.resolve(__dirname, '.env') });

// create express app
const app = express();

//morgan
if (process.env.NODE_ENV != "production") {
   app.use(morgan('dev'));
}

//helmet
app.use(helmet());

//parse json request url
app.use(express.json());

// parse json request body
app.use(express.urlencoded({ extended: true }));

//sanitize request data
app.use(mongoSanitize())

//enable cookie parser
app.use(cookieParser())

//gzip compression
app.use(compression())

//file upload
app.use(fileUpload({
   useTempFiles: true,
}))

//cors
app.use(cors());


//api v1 routes
app.use('/api/v1', routes);


app.post('/test', (req, res) => {
   // console.log(req.body);
   // res.status(409).json({message : "there is conflict."});
   throw createHttpError.BadRequest('this route has an error.');
});


app.use(async(req,res,next)=>{
   next( createHttpError.NotFound("This route doesn't exist"));
});


// error handling
app.use(async(err,req,res,next)=>{
   res.status(err.status || 500);
   res.send({
      error:{
         status:err.status || 500,
         message:err.message,
      },
   });
});

app.get('/', (req, res) => {
   res.send("Hello from server.");
});

export default app;

