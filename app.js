import express  from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import compression from "compression";
import fileUpload from "express-fileupload";
import cors from 'cors';
import createHttpError from "http-errors";
import routes from "./routes/index.js";








//creating an express app
dotenv.config();

const app = express();
//moragn
if(process.env.NODE_ENV !=="production")
{
app.use(morgan("dev"));
}

//helmet 
app.use(helmet());

app.use(express.json());
//parse json reuest 
app.use(express.urlencoded({extended:true}));

//santize request
app.use(mongoSanitize());


// Enable cookie parsel 
app.use(cookieParser());

//zip compress
app.use(compression());

//file upload
app.use(fileUpload({
    useTempFiles:true,
}));

//cors 
app.use(cors());

//route

app.use("/api/v1",routes)

// app.post('/test',(req,res)=>{
   
//     throw createHttpError.BadRequest("THIS ROUTE HAS AN ERROR");
//     // res.send(req.body);
// });

app.use(async(req,res,next)=>
{
    next(createHttpError.NotFound("This route does not exist"));
});

// httperror handling 
app.use(async(err,req,res,next)=>
{
    res.status(err.status || 500 );
    res.send({
        error:{
            status:err.status || 500 ,
            message:err.message,
        },

    });
});



const PORT= 8000;

export default app;