// importing the necessary modules 
const express = require('express'); 
const News = require('../models/News'); 
const multer = require('multer'); 
const path = require('path'); 

// Creating the router object 
const router = express.Router(); 

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Save images to an 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Unique filename
    }
});

const upload = multer({ storage: storage });

// Create news (Admin Only)
router.post('/', upload.single('images'), async (req, res) => {
    try {
        const { title, text, tags } = req.body;

        // Store image file path (if uploaded)
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        // Convert tags from string to array (if necessary)
        const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

        // Create a new News object
        const news = new News({
            title,
            text,
            images: imagePath,  // Save the image path
            tags: tagsArray
        });

        // Save to database
        await news.save();
        return res.status(201).json(news);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error adding news" });
    }
});

// Get all news with pagination (Infinite Scroll)
router.get('/', async (req, res) => {
    const { page = 1, limit = 3 } = req.query;
    const news = await News.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json(news);
});

// Get tags 
router.get('/tags', async (req, res) => {
    try {
        // Get only 'tags' field from all news
        const allNews = await News.find({}, 'tags'); 
        const uniqueTags = [...new Set(allNews.flatMap(news => news.tags))]; // Flatten and remove duplicates
        return res.json(uniqueTags);
    } catch (error) {
        console.error('Error fetching unique tags:', error);
        return res.status(500).json({ message: 'Error fetching tags' });
    }
});


// Get news by tag
router.get('/tag/:tag', async (req, res) => {
    const news = await News.find({ tags: { $in: [req.params.tag] } });
    return res.json(news);
});

// Get single news by ID and increment views
router.get('/:id', async (req, res) => {
    const news = await News.findById(req.params.id);
    if (news) {
        news.views += 1;
        await news.save();
        res.json(news);
    } else {
        res.status(404).json({ message: 'News not found' });
    }
});

// Delete news
router.delete('/:id', async (req, res) => {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: 'News deleted successfully' });
});

// Like/Dislike news
router.post('/:id/like', async (req, res) => {
    const news = await News.findById(req.params.id);
    news.likes += 1;
    await news.save();
    res.json({ likes: news.likes });
});


// dislike route 
router.post('/:id/dislike', async (req, res) => {
    const news = await News.findById(req.params.id);
    news.dislikes += 1;
    await news.save();
    res.json({ dislikes: news.dislikes });
});

// Get all unique tags 
// router.get('/tags/:tag', async(req, res) => {
//     try {
//         // fetch the unique tags 
//         const news = await News.find({ tags: req.params.tag });  
//         return res.json(news); 
//     }

//     catch (error) {
//         // Getting the error 
//         console.error('Error fetching tags', error); 
//         return res.json({message: 'Error fetching tags'})
//     }
// })

module.exports = router;