require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const News = require('./models/News');

// Setting the database uri 
const databaseURI = "mongodb://localhost/zavodProject"; 

// Connect to MongoDB
mongoose.connect(databaseURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Generate fake news data
const generateFakeNews = (count = 20) => {
    const newsData = [];

    for (let i = 0; i < count; i++) {
        newsData.push({
            title: faker.lorem.sentence(),
            text: faker.lorem.paragraphs(2),
            images: [faker.image.url(), faker.image.url()],
            tags: faker.helpers.arrayElements(['politics', 'technology', 'sports', 'health', 'entertainment'], 2),
            likes: faker.number.int({ min: 0, max: 500 }),
            dislikes: faker.number.int({ min: 0, max: 100 }),
            views: faker.number.int({ min: 0, max: 10000 }),
            createdAt: faker.date.past()
        });
    }

    return newsData;
};

// Insert fake news into MongoDB
const seedDatabase = async () => {
    try {
        await News.deleteMany(); // Clear existing data
        const fakeNews = generateFakeNews(250); // Generate 50 fake news articles
        await News.insertMany(fakeNews);
        console.log('Database seeded with fake news!');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding database:', error);
        mongoose.connection.close();
    }
};

// Run the script
seedDatabase();
