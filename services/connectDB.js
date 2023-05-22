const pool=require('./db');

const connectDB = (req, res, next) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error getting connection from pool:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      req.dbConnection = connection;
      next();
    });
};
  
  module.exports = connectDB;