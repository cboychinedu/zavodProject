// importing the necessary modules 
const express = require('express'); 

// Creating the router object 
const router = express.Router(); 

// Setting the router for the home page 
router.get('/', async(req, res) => {
    // 
    return res.send("<p> Hello User </p>"); 
})

// Exporting the router object 
module.exports = router; 