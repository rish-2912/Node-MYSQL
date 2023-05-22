
const { selectQuery, insertQuery, beginTransaction, commitTransaction, rollbackTransaction, deleteQuery, updateQuery } = require('../services/helper');


const listEmployees=async(req,res,next)=>{
    try{
        const connection=req.dbConnection;
        const page=req.query.pg || 1;
        const lim=req.query.limit || 3;

        const skip=(page-1)*lim;

        const query = `SELECT employee.*,primary_contact.name as p_name,primary_contact.phone as p_phone,primary_contact.relationship as p_relationship,secondary_contact.name as s_name,secondary_contact.phone as s_phone,secondary_contact.relationship as s_relationship FROM employee INNER JOIN primary_contact on employee.e_id=primary_contact.emp_id INNER JOIN secondary_contact on employee.e_id=secondary_contact.emp_id WHERE e_id>${skip} AND e_id<=${page*lim}`;
        const results = await selectQuery(connection,query);


        connection.release();


        res.status(200).json({
            message:'success',
            data:{
                employees:results
            }
        });
    }
    catch(err){
        const connection=req.dbConnection;
        await rollbackTransaction(connection);
        res.status(500).json({
            message:'Internal server error'
        });
        console.log(err);
    }
}


const createEmployee=async(req,res,next)=>{
    try{
        const {name, title, phone, email, address, city, state,primary_name,primary_relationship,primary_phone,secondary_name,secondary_relationship,secondary_phone} = req.body;
        const connection=req.dbConnection;

        await beginTransaction(connection);

        let query = 'INSERT INTO employee (name, title, phone, email, address, city, state) VALUES (?, ?, ?, ?, ?, ?, ?)';
        let values = [name, title, phone, email, address, city, state];
        const results=await insertQuery(connection,query,values);

        query = 'INSERT INTO primary_contact (name,relationship,phone,emp_id) VALUES (?, ?, ?, ?)';
        values = [primary_name,primary_relationship,primary_phone,results['insertId']];
        await insertQuery(connection,query,values);

        query = 'INSERT INTO secondary_contact (name,relationship,phone,emp_id) VALUES (?, ?, ?, ?)';
        values = [secondary_name,secondary_relationship,secondary_phone,results['insertId']];
        await insertQuery(connection,query,values);

        await commitTransaction(connection);

        connection.release();


        res.status(201).json({
            status:'success',
            message:'Employee created successfully'
        });
    }
    catch(err){
        const connection=req.dbConnection;
        await rollbackTransaction(connection);
        res.status(500).json({
            message:'Internal server error'
        });
        console.log(err);
    }
}


const updateEmployee=async(req,res,next)=>{
    try{
        const connection=req.dbConnection;
        await beginTransaction(connection);

        let emp_details=[],primary_details=[],secondary_details=[],primary_values=[],secondary_values=[],emp_values=[];
        for(let field in req.body){
            if(field.includes("primary")){
                primary_details.push(`${field.split('_')[1]}=?`);
                primary_values.push(req.body[field]);
            }
            else if(field.includes("secondary")){
                secondary_details.push(field.split('_')[1]);
                secondary_values.push(req.body[field]);
            }
            else{
                emp_details.push(`${field}=?`);
                emp_values.push(req.body[field]);
            }
        }
        let query;
        if(emp_details){
            query=`UPDATE employee SET ${emp_details.join(', ')} WHERE e_id=${req.params.id}`;
            await updateQuery(connection,query,emp_values); 
        }
        if(primary_details.length!=0){
            query=`UPDATE primary_contact SET ${primary_details.join(', ')} WHERE emp_id=${req.params.id}`; 
            await updateQuery(connection,query,primary_values); 
        }
        if(secondary_details.length!=0){
            query=`UPDATE secondary_contact SET ${secondary_details.join(', ')} WHERE emp_id=${req.params.id}`; 
            await updateQuery(connection,query,secondary_values); 
        }

        await commitTransaction(connection);

        
        connection.release();


        res.status(200).json({
            message:'employee details updated successfully',
        });
    }
    catch(err){
        const connection=req.dbConnection;
        await rollbackTransaction(connection);
        res.status(500).json({
            message:'Internal server error'
        });
        console.log(err);
    }
}


const getEmployee=async(req,res,next)=>{
    try{
        const connection=req.dbConnection;


        const query = `SELECT employee.*,primary_contact.name as p_name,primary_contact.phone as p_phone,primary_contact.relationship as p_relationship,secondary_contact.name as s_name,secondary_contact.phone as s_phone,secondary_contact.relationship as s_relationship FROM employee INNER JOIN primary_contact on employee.e_id=primary_contact.emp_id INNER JOIN secondary_contact on employee.e_id=secondary_contact.emp_id WHERE e_id=${req.params.id}`;
        const results = await selectQuery(connection,query);


        connection.release();


        res.status(200).json({
            message:'success',
            data:{
                employee:results
            }
        });
    }
    catch(err){
        const connection=req.dbConnection;
        await rollbackTransaction(connection);
        res.status(500).json({
            message:'Internal server error'
        });
        console.log(err);
    }
}


const deleteEmployee=async(req,res,next)=>{
    try{
        const connection=req.dbConnection;

        await beginTransaction(connection);
        const query = `DELETE FROM employee WHERE e_id=${req.params.id}`;
        await deleteQuery(connection,query);

        await commitTransaction(connection);

        connection.release();

        res.status(204).json({
            
        })

       
    }
    catch(err){
        const connection=req.dbConnection;
        await rollbackTransaction(connection);
        res.status(500).json({
            message:'Internal server error'
        });
        console.log(err);
    }
    
}

module.exports={listEmployees,createEmployee,getEmployee,updateEmployee,deleteEmployee};