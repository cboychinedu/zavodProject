import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Container, Card, Spinner, Image, Form } from 'react-bootstrap';

const NewsByTag = () => {
    const [news, setNews] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch unique tags from the server (Assumes backend has an endpoint for this)
    const fetchTags = async () => {
        try {
            const res = await axios.get('http://localhost:3001/news/tags');
            setTags(res.data);
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    // Fetch news by selected tag
    const fetchNewsByTag = async (tag) => {
        if (!tag) return;
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:3001/news/tag/${encodeURIComponent(tag)}`);
            setNews(res.data);
        } catch (error) {
            console.error('Error fetching news by tag:', error);
        }
        setLoading(false);
    };

    // Handle like/dislike actions
    const handleLike = async (id) => {
        try {
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

    const handleDislike = async (id) => {
        try {
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
        fetchTags();
    }, []);

    return (
        <Container className="d-flex flex-column align-items-center mt-4">
            <h2 className="mb-4">News by Tag</h2>

            {/* Tag Selection Dropdown */}
            <Form.Select
                value={selectedTag}
                onChange={(e) => {
                    setSelectedTag(e.target.value);
                    fetchNewsByTag(e.target.value);
                }}
                className="mb-3"
                style={{ maxWidth: "400px" }}
            >
                <option value="">Select a tag</option>
                {tags.map((tag, index) => (
                    <option key={index} value={tag}>{tag}</option>
                ))}
            </Form.Select>

            {loading ? (
                <Spinner animation="border" />
            ) : (
                <div style={{ maxWidth: "600px", width: "100%" }}>
                    {news.length === 0 && selectedTag && (
                        <p className="text-center mt-3">No news found for this tag.</p>
                    )}
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
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )}
        </Container>
    );
};

export default NewsByTag;
