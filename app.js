const express = require('express');
const app = express();
const productRoutes = require('./API/Routes/products');
const orderRoutes = require('./API/Routes/orders');
const userRoutes = require('./API/Routes/user');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb+srv://<LOG_IN>:' + process.env.MONGO_ATLAS_PW + '@project0.gn3mtda.mongodb.net/?retryWrites=true&w=majority');

// Logging calls
app.use(morgan('dev'));

// Parsing JSONs
app.use('/uploads', express.static('Uploads'));
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

// Handling CORS Errors
app.use((req, res, next) => {
    res.header("Access-Controle-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    
    if(req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

// Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

// Handling Errors
app.use((req, res, next) => {
    const error = new Error('Could Not Find Any Matching Service');
    error.status = 404;
    next(error);
});

// Handling Errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error : {
            message : error.message
        }
    });
});

module.exports = app;
