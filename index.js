const dotenv=require('dotenv');
dotenv.config({path:'./.env'});
const app=require('./app');



app.listen(process.env.PORT,()=>{
    console.log('server started');
});
