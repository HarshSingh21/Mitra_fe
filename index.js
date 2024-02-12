import mongoose from "mongoose";
import app from "./app.js";
import logger from "./configs/logger.js"

//env variable

const {DATABASE_URL} =  process.env;
const PORT = process.env.PORT || 8000;
console.log(process.env.NODE_ENV);



// exit mongoose/

mongoose.connection.on('error',(err)=>
{
    logger.error(`Mongodb connection error : ${err} `);
    process.exit(1);
});

//debug

if(process.env.NODE_ENV!=="prduction")
{
   
    mongoose.set('debug',true);
};


//mongo
mongoose.connect(DATABASE_URL,{
    useNewUrlParser: true,
    useUnifiedTopology:true,
}).then(()=>
{
    logger.info('Connected to Mongodb');

});

let server;
server = app.listen(PORT, ()=> {
   logger.info(`Server is listening at ${PORT}. `);
//  throw new Error("Error in server."); 

console.log("process id",process.pid);
});


const exitHandler=()=>
{
if(server)
{
logger.info('server closed ');
process.exit(1);
}
else{
    process.exit(1);
}
};

// handle error
const unexpectedErrorHandler = (error) =>
{
    logger.error(error);
   exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);

process.on("unhandledRejection", unexpectedErrorHandler);

//sigterm i used because server will be on linux 
process.on("SIGTERM",()=>
{
    if(server)
    {
    logger.info('server closed ');
    process.exit(1);
    }
});