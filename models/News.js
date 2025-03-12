// importing the necessary modules 
const mongodb = require('mongoose'); 

// setting the schema 
const newsSchema = new mongodb.Schema({
    title: String, 
    text: String, 
    images: [String], 
    tags: [String], 
    likes: { type: Number, default: 0 }, 
    dislikes: { type: Number, default: 0 }, 
    views: { type: Number, default: 0 }, 
    createAt: { type: Date, default: Date.now }
}); 

// Creating the schema 
News = mongodb.model('News', newsSchema); 

// Exporting the news schema 
module.exports = News; 