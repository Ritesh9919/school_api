import express from 'express';
import cors from 'cors'
import schoolRouter from './routes/school.route.js'
import {errorHandlerMiddleware} from './middlewares/errorHandler.middleware.js'



const app = express();

app.use(express.json());
app.use(cors());


app.get('/', (req, res)=> {
    res.send("Hello World");
})


app.use('/api/school', schoolRouter);
app.use(errorHandlerMiddleware);



export {app}