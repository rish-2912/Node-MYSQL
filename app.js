const express=require('express');
const empRouter=require('./routes/empRoutes');


const app=express();


app.use(express.json());
app.use('/api/employee',empRouter);


module.exports=app;