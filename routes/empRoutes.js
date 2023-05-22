const express=require('express');
const {listEmployees, createEmployee, getEmployee, updateEmployee, deleteEmployee}=require('../controllers/empController');
const connectDB = require('../services/connectDB');


const router=express.Router();
router.use(connectDB);

router.route('/').get(listEmployees).post(createEmployee);
router.route('/:id').get(getEmployee).patch(updateEmployee).delete(deleteEmployee);


module.exports=router;
