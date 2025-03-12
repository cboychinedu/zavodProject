// importing the necessary modules 
const express = require('express'); 
const cors = require('cors'); 
const mongodb = require('mongoose'); 
const morgan = require('morgan'); 
const chalk = require('chalk');  

// Setting the database URI 
const databaseURI = "mongodb://localhost/zavodProject"; 

// Connecting to the mongodb database 
mongodb.connect(databaseURI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
}).then(() => {
    // on successful connection 
    console.log('Connected to the mongodb database server...'); 
})
// on error in connecting to the mondodb database 
.catch((error) => {
    // On failure 
    console.log('Error connecting to the mongodb database server...'); 
})

// using dotenv 
require('dotenv').config(); 

// initialzed the express ap 
const app = express(); 

// using some necessary middlewares 
app.use(cors())
app.use(express.json())
app.use(morgan('combined'));
app.use('/uploads', express.static('uploads'));
// app.use(morgan('combined', { stream: accessLogStream }));

// Setting the port and host number 
const PORT = process.env.PORT || 3001; 
const HOST = process.env.HOST || 'localhost'; 

// Importing the home route 
const home = require('./routes/homeRoutes'); 
const newsRoute = require('./routes/newsRoutes'); 

// Setting the route conigurations 
app.use('/', home); 
app.use('/news', newsRoute); 

// running the nodejs server 
app.listen(PORT, HOST, () => {
    // displaying the server message 
    let serverMessage = chalk.red(`The server is running on ${HOST + ":" + PORT}`); 
    console.log(serverMessage); 
})