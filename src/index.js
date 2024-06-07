import app from './app.js'


// env variables
const PORT = process.env.PORT || 8000;
console.log(process.env.NODE_ENV);

app.listen(PORT,()=>{
   // console.log("Server is running at",PORT);
    console.log(`Server is running on port ${PORT}`);
});

