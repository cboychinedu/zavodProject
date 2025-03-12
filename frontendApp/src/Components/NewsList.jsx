// Importing the necessary modules 
import React, { useState, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import { Button, Container, Card, Spinner, Image } from 'react-bootstrap';

// Creating the news list component 
const NewsList = () => {
    // Setting the state 
    const [news, setNews] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const firstFetch = useRef(false); 

    // Creating a function for fetching news 
    const fetchNews = async () => {
        try {
            // making get request to the backend server 
            const res = await axios.get(`http://localhost:3001/news?page=${page}`);

            // if the data has a length of zero 
            if (res.data.length === 0) {
                setHasMore(false);

            } else {
                // Setting the news and page 
                setNews(prevNews => [...prevNews, ...res.data]);
                setPage(prevPage => prevPage + 1);
            }

        } 
        // Catching the error 
        catch (error) {
            console.error("Error fetching news:", error);
        }
    };

    // Creating a delete function 
    const deleteNews = async (id) => {
        // Setting the alert message 
        const confirmDelete = window.confirm("Are you sure you want to delete this news?");
        if (!confirmDelete) return;

        try {
            // deleting the news 
            await axios.delete(`http://localhost:3001/news/${id}`);
            setNews(prevNews => prevNews.filter(item => item._id !== id));

            // reload the page  
            window.location.reload(); 
        } catch (error) {
            console.error("Error deleting news:", error);
        }
    };

    // Creating a function for handling the like 
    const handleLike = async (id) => {
        try {
            // Setting the url link 
            const res = await axios.post(`http://localhost:3001/news/${id}/like`);
            setNews(prevNews => 
                prevNews.map(item => 
                    item._id === id ? { ...item, likes: res.data.likes } : item
                )
            );
        } catch (error) {
            console.error("Error liking news:", error);
        }
    };

    // Creating a function for handling the dislike function 
    const handleDislike = async (id) => {
        try {
            // Setting the url link
            const res = await axios.post(`http://localhost:3001/news/${id}/dislike`);
            setNews(prevNews => 
                prevNews.map(item => 
                    item._id === id ? { ...item, dislikes: res.data.dislikes } : item
                )
            );
        } catch (error) {
            console.error("Error disliking news:", error);
        }
    };

    useEffect(() => {
        if (!firstFetch.current) {
            // Prevent duplicate call
            firstFetch.current = true; 
            fetchNews();
        }
    }, []); // Empty dependency array ensures it runs only once

    return (
        <Container className="d-flex flex-column align-items-center mt-4">
            <h2 className="mb-4">News List</h2>
            <div style={{ maxWidth: "600px", width: "100%" }}>
                <InfiniteScroll
                    dataLength={news.length}
                    next={fetchNews}
                    hasMore={hasMore}
                    loader={<Spinner animation="border" className="d-block mx-auto" />}
                    endMessage={<p className="text-center mt-3">No more news to show</p>}
                >
                    {news.map(item => (
                        <Card key={item._id} className="mb-4 shadow-sm">
                            {item.images && (
                                <Image 
                                    src={`http://localhost:3001${item.images}`} 
                                    alt="News" 
                                    className="card-img-top" 
                                    style={{ height: "200px", objectFit: "cover" }} 
                                />
                            )}

                            <Card.Body>
                                <Card.Title>{item.title}</Card.Title>
                                <Card.Text>{item.text}</Card.Text>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <Button 
                                            variant="success" 
                                            className="me-2" 
                                            onClick={() => handleLike(item._id)}
                                        >
                                            👍 {item.likes}
                                        </Button>
                                        <Button 
                                            variant="danger" 
                                            className="me-2" 
                                            onClick={() => handleDislike(item._id)}
                                        >
                                            👎 {item.dislikes}
                                        </Button>
                                    </div>
                                    <Button variant="outline-danger" onClick={() => deleteNews(item._id)}>
                                        🗑 Delete
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </InfiniteScroll>
            </div>
        </Container>
    );
};

// exporting the news list 
export default NewsList;
