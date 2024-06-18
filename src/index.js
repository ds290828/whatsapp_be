import app from './app.js'
import logger from './configs/logger.config.js'
import mongoose from 'mongoose'


// env variables
const DATABASE_URL="mongodb+srv://divyanshusingh290828:ODINI145W9kf1uxS@cluster0.puk0yfv.mongodb.net/Whatsapp?retryWrites=true&w=majority&appName=Cluster0"
// const { DATABASE_URL } = process.env;
console.log("divyanshuSingh");
console.log('MongoDB URI:', DATABASE_URL);

const PORT = process.env.PORT || 8000;
console.log(process.env.NODE_ENV);

//exit on mongodb error
mongoose.connection.on("error", (err) => {
    logger.error(`Mongodb Connection Error ${err}`);
    process.exit(1);
});

//mongodb debug mode
if(process.env.NODE_ENV!=="production"){
    mongoose.set('debug', true);
}


//mongodb connection
mongoose.connect(DATABASE_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        logger.info("connected to mongodb.");
    });


let server;
server = app.listen(PORT, () => {
    // console.log("Server is running at",PORT);
    logger.info(`Server is running on port ${PORT}`)
    //  throw new Error ("error in server.");
    // console.log(process.pid);
});

// handle server errors

const exitHandler = () => {
    if (server) {
        logger.info("Server closed");
        process.exit(1);
    }
    else {
        process.exit(1);
    }
}

const unexpectedErrorHandler = (error) => {
    logger.error(error.message);
    exitHandler();
}
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

//SIGTERM
process.on("SIGTERM", () => {
    if (server) {
        logger.info("Server closed");
        process.exit(1);
    }
})


