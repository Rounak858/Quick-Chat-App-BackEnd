const mongoose = require('mongoose');
//connect to mongoDB database
mongoose.connect(process.env.CONN_STRING);

//connection state
const db = mongoose.connection;

//checking the DB connection
db.on('connected', () => {
    console.log('Connected to MongoDB');
});

db.on('error', () => {
    console.log('Error connecting to MongoDB');
});


module.exports = db;