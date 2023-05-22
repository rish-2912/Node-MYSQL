const util=require('util');

const beginTransaction=async (connection)=>{
    return await util.promisify(connection.beginTransaction).bind(connection)();
}
const commitTransaction=async (connection)=>{
    return await util.promisify(connection.commit).bind(connection)();
}
const rollbackTransaction=async(connection)=>{
    return await util.promisify(connection.rollback).bind(connection)();
}
const selectQuery=async(connection,query)=>{
    return await util.promisify(connection.query).bind(connection)(query);
}
const insertQuery=async(connection,query,values)=>{
    return await util.promisify(connection.query).bind(connection)(query,values);
}
const deleteQuery=async(connection,query)=>{
    return await util.promisify(connection.query).bind(connection)(query);
}
const updateQuery=async(connection,query,values)=>{
    return await util.promisify(connection.query).bind(connection)(query,values);
}
module.exports={beginTransaction,commitTransaction,rollbackTransaction,selectQuery,insertQuery,deleteQuery,updateQuery}