import app from './app.js'
import logger from './configs/logger.config.js'


// env variables
const PORT = process.env.PORT || 8000;
console.log(process.env.NODE_ENV);

app.listen(PORT,()=>{
   // console.log("Server is running at",PORT);
    logger.info(`Server is running on port ${PORT}`);
});

