import dotenv from 'dotenv';
import app from './app.js'


//Dotenv config for accessing the variable that we define .dotenv file.
dotenv.config();

// env variables
const PORT = process.env.PORT || 8000;


app.listen(PORT,()=>{
   // console.log("Server is running at",PORT);
    console.log(`Server is running on port ${PORT}..`);
});

